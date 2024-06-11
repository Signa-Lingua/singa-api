import StaticTranscript from '#models/static_transcript'
import StaticTranslation from '#models/static_translation'
import env from '#start/env'
import { PredictionResponse, PredictionValidationError } from '#types/Prediction'
import logger from '@adonisjs/core/services/logger'
import { Job } from '@rlanz/bull-queue'
import axios, { AxiosError } from 'axios'

interface PredictStaticJobPayload {
  staticTranslationId: number
  userId: number
  video: File
}

export default class PredictStaticJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: PredictStaticJobPayload) {
    const { staticTranslationId, userId, video } = payload

    const baseUrl = env.get('PREDICT_API_HOST')

    if (!baseUrl) {
      throw new Error('Prediction URL is not set')
    }

    try {
      const formData = new FormData()

      formData.append('video', video)

      const response = await axios.post(`${baseUrl}/predict`, formData)

      if (response.status === 200) {
        const { data } = response.data as PredictionResponse

        await StaticTranslation.query()
          .where('id', staticTranslationId)
          .andWhere('userId', userId)
          .update({ status: 'success' })

        for (const prediction of data) {
          await StaticTranscript.create({
            staticTranslationId,
            text: prediction.text,
            userId,
            timestamp: prediction.timestamp,
          })
        }
      }
    } catch (error) {
      await StaticTranslation.query()
        .where('id', staticTranslationId)
        .andWhere('userId', userId)
        .update({ status: 'failed' })

      const normalError = error as AxiosError<PredictionResponse>

      if (normalError.response?.data.error) {
        logger.error(normalError.response?.data)
        return
      }

      const customError = error as AxiosError<PredictionValidationError>

      if (customError.response?.data.detail) {
        logger.error(customError.response?.data.detail)
        return
      }

      logger.error(error)
      return
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue() {}
}
