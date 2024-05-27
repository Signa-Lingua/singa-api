import { HTTP } from '#lib/constants/http'
import ConversationNode from '#models/conversation_node'
import ConversationTranslation from '#models/conversation_translation'
import responseFormatter from '#utils/response_formatter'
import { conversationNodeSpeechValidator } from '#validators/conversation_translation'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConversationNodeSpeechesController {
  /**
   * Handle form submission for the create action
   */
  async store({ auth, params, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const { file, type } = await request.validateUsing(conversationNodeSpeechValidator)

    const conversationTranslation = await ConversationTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .first()

    if (!conversationTranslation) {
      return response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Conversation translation not found')
      )
    }
    // TODO: Request To Speech to Text Service

    const conversationNode = await ConversationNode.create({
      conversationTranslationId: conversationTranslation.id,
      userId,
      type,
    })

    // TODO: Add transcript to return response.
    // Require previous TODO
    return response.created(
      responseFormatter(
        HTTP.CREATED,
        'success',
        'Create conversation translation node speech success',
        conversationNode
      )
    )
  }
}
