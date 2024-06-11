import axios, { AxiosError } from 'axios'
import { Job } from '@rlanz/bull-queue'
import env from '#start/env'
import ConversationNode from '#models/conversation_node'
import { PredictionResponse, PredictionValidationError } from '#types/Prediction'
import ConversationTranscript from '#models/conversation_transcript'
import logger from '@adonisjs/core/services/logger'

interface PredictJobPayload {
  userId: number
  conversationNodeId: number
  conversationTranslationId: number
  video: File
}

export default class PredictJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: PredictJobPayload) {
    const { userId, video, conversationNodeId, conversationTranslationId } = payload

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

        await ConversationNode.query()
          .where('id', conversationNodeId)
          .andWhere('conversationTranslationId', conversationTranslationId)
          .update({ status: 'success' })

        for (const prediction of data) {
          await ConversationTranscript.create({
            conversationNodeId,
            text: prediction.text,
            userId,
            timestamp: prediction.timestamp,
          })
        }
      }
    } catch (error) {
      await ConversationNode.query()
        .where('id', conversationNodeId)
        .andWhere('conversationTranslationId', conversationTranslationId)
        .update({ status: 'failed' })

      const normalError = error as AxiosError<PredictionResponse>

      if (normalError.response?.data.error) {
        logger.error(normalError.response?.data)
        console.log(normalError.response?.data)
        return
      }

      const customError = error as AxiosError<PredictionValidationError>

      if (customError.response?.data.detail) {
        logger.error(customError.response?.data.detail)
        console.log(customError.response?.data.detail)
        return
      }

      logger.error(error)
      console.log(error)
      return
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue() {}
}
