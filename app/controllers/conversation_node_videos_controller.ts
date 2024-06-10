import { HTTP } from '#lib/constants/http'
import ConversationNode from '#models/conversation_node'
import ConversationTranslation from '#models/conversation_translation'
import { resizeVideo } from '#services/ffmpeg_service'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import env from '#start/env'
import { generateFileName } from '#utils/generator'
import responseFormatter from '#utils/response_formatter'
import { conversationNodeVideoValidator } from '#validators/conversation_translation'
import type { HttpContext } from '@adonisjs/core/http'
import PredictJob from '../jobs/predict_job.js'
import { Status } from '#lib/constants/status'
import { convertMultipartFileToFile } from '#utils/converter'

export default class ConversationNodeVideosController {
  /**
   * Show individual record
   */
  async show({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const conversationTranslation = await ConversationNode.query()
      .where('user_id', userId!)
      .where('id', params.transcriptId)
      .where('conversation_translation_id', params.conversationTranslationId)
      .preload('transcripts', (query) => {
        query.orderBy('created_at', 'asc')
      })
      .first()

    if (!conversationTranslation) {
      return response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Conversation translation not found')
      )
    }

    return response.ok(
      responseFormatter(
        HTTP.OK,
        'success',
        'Get conversation translation success',
        conversationTranslation
      )
    )
  }
  /**
   * Handle form submission for the create action
   */
  async store({ auth, params, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id
    const isGuest = auth.use('jwt').user?.provider === null

    const { file, type } = await request.validateUsing(conversationNodeVideoValidator)

    const conversationTranslation = await ConversationTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .first()

    if (!conversationTranslation) {
      return response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Conversation translation not found')
      )
    }

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
      env.get('CONVERSATION_STORAGE_PATH'),
      resizeResult.resizedVideoPath,
      generatedFileName
    )

    resizeResult.cleanupFile()

    if (fileUrl.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', fileUrl.message, null)
      )
    }

    const conversationNode = await ConversationNode.create({
      status: Status.PENDING,
      conversationTranslationId: conversationTranslation.id,
      userId,
      video: generatedFileName,
      videoUrl: fileUrl.data,
      type,
    })
    const predictJob = new PredictJob()

    const files = await convertMultipartFileToFile(file)

    if (files.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', files.message)
      )
    }

    predictJob.handle({
      userId: userId!,
      video: files.data,
      conversationNodeId: conversationNode.id,
      conversationTranslationId: conversationTranslation.id,
    })

    // Require previous TODO
    return response.created(
      responseFormatter(
        HTTP.CREATED,
        'success',
        'Create conversation translation node video success',
        conversationNode
      )
    )
  }
}
