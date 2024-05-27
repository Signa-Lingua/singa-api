import { HTTP } from '#lib/constants/http'
import ConversationNode from '#models/conversation_node'
import ConversationTranslation from '#models/conversation_translation'
import googleCloudStorageService from '#services/google_cloud_storage_service'
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

    // TODO: Request To Machine Learning Service

    const generatedFileName = generateFileName(userId!, file.extname ? file.extname : 'mp4')

    const fileUrl = await googleCloudStorageService.save(
      'conversation-translation',
      file.tmpPath!,
      generatedFileName
    )

    if (fileUrl.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', fileUrl.message, null)
      )
    }

    const conversationNode = await ConversationNode.create({
      conversationTranslationId: conversationTranslation.id,
      userId,
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
