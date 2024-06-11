import StaticTranslation from '#models/static_translation'
import type { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '#utils/response_formatter'
import {
  staticTranslationUpdateValidator,
  staticTranslationValidator,
} from '#validators/static_translation'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import { generateFileName } from '#utils/generator'
import { HTTP } from '#lib/constants/http'
import env from '#start/env'
import { resizeVideo } from '#services/ffmpeg_service'
import PredictStaticJob from '../jobs/predict_static_job.js'
import { convertMultipartFileToFile } from '#utils/converter'
import { Status } from '#lib/constants/status'

export default class StaticTranslationsController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const staticTranslations = await StaticTranslation.query()
      .where('user_id', userId!)
      .select('id', 'title', 'videoUrl', 'status', 'createdAt', 'updatedAt')

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'Get list of static translations', staticTranslations)
    )
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, response, request }: HttpContext) {
    const userId = auth.use('jwt').user?.id
    const isGuest = auth.use('jwt').user?.provider === null

    const { title, file } = await request.validateUsing(staticTranslationValidator)

    const usedQuota = await googleCloudStorageService.getUserUsedQuota(userId!)

    if (usedQuota.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', usedQuota.message)
      )
    }

    if (
      (usedQuota.data > env.get('GUEST_QUOTA') && isGuest) ||
      (usedQuota.data > env.get('USER_QUOTA') && !isGuest)
    ) {
      return response.forbidden(
        responseFormatter(HTTP.FORBIDDEN, 'error', 'User storage quota exceeded')
      )
    }

    const resizeResult = await resizeVideo(file.tmpPath!)

    if (resizeResult.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', resizeResult.message)
      )
    }

    const generatedFileName = generateFileName(userId!, file.extname ? file.extname : 'mp4')

    const fileUrl = await googleCloudStorageService.save(
      env.get('STATIC_STORAGE_PATH'),
      resizeResult.resizedVideoPath,
      generatedFileName
    )

    resizeResult.cleanupFile()

    if (fileUrl.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', fileUrl.message, null)
      )
    }

    const staticTranslation = await StaticTranslation.create({
      title,
      video: generatedFileName,
      videoUrl: fileUrl.data,
      userId,
      status: Status.PENDING,
    })

    const predictStaticJob = new PredictStaticJob()

    const files = await convertMultipartFileToFile(file)

    if (files.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', files.message)
      )
    }

    predictStaticJob.handle({
      staticTranslationId: staticTranslation.id,
      userId: userId!,
      video: files.data,
    })

    return response.created(
      responseFormatter(
        HTTP.CREATED,
        'success',
        'Create static translation success',
        staticTranslation
      )
    )
  }

  /**
   * Show individual record
   */
  async show({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const staticTranslations = await StaticTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .select('id', 'title', 'videoUrl', 'status', 'createdAt', 'updatedAt')
      .preload('transcripts', (query) => query.orderBy('timestamp', 'asc'))
      .first()

    if (!staticTranslations) {
      return response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Static translation not found')
      )
    }

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'Static translation found', staticTranslations)
    )
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const { title } = await request.validateUsing(staticTranslationUpdateValidator)

    const staticTranslation = await StaticTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .first()

    if (!staticTranslation) {
      return response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Static translation not found')
      )
    }

    staticTranslation.title = title

    await staticTranslation.save()

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'Update static translation success', staticTranslation)
    )
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const staticTranslation = await StaticTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .first()

    if (!staticTranslation) {
      return response.notFound(
        responseFormatter(HTTP.BAD_REQUEST, 'error', 'Static translation not found')
      )
    }

    if (staticTranslation.video) {
      const fileDelete = await googleCloudStorageService.delete(
        env.get('STATIC_STORAGE_PATH'),
        staticTranslation.video
      )

      if (fileDelete.error) {
        return response.internalServerError(
          responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', fileDelete.message)
        )
      }
    }

    await staticTranslation.delete()

    return response.ok(responseFormatter(HTTP.OK, 'success', 'Delete static translation success'))
  }
}
