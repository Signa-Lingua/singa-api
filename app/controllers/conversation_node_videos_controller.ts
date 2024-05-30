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

export default class ConversationNodeVideosController {
  /**
   * Handle form submission for the create action
   */
  async store({ auth, params, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

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

    const usedQuota = await googleCloudStorageService.getUserUsedQuota('conversation', userId!)

    if (usedQuota.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', usedQuota.message)
      )
    }

    if (usedQuota.data > env.get('CONVERSATION_QUOTA')) {
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

    // TODO: Request To Machine Learning Service

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
      conversationTranslationId: conversationTranslation.id,
      userId,
      video: generatedFileName,
      videoUrl: fileUrl.data,
      type,
    })

    // TODO: Add transcript to return response.
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
