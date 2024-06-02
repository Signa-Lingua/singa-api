import { HTTP } from '#lib/constants/http'
import ConversationNode from '#models/conversation_node'
import ConversationTranscript from '#models/conversation_transcript'
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

    const { text, type } = await request.validateUsing(conversationNodeSpeechValidator)

    const conversationTranslation = await ConversationTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .first()

    if (!conversationTranslation) {
      return response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Conversation translation not found')
      )
    }

    try {
      const conversationNode = await ConversationNode.create({
        conversationTranslationId: conversationTranslation.id,
        userId,
        type,
      })
      const conversationNodeSpeechTranscript = await ConversationTranscript.create({
        userId,
        conversationNodeId: conversationNode.id,
        text,
        timestamp: '00:00:00.000',
      })
      const payload = {
        ...conversationNode.toJSON(),
        transcript: conversationNodeSpeechTranscript.toJSON(),
      }

      // TODO: Add transcript to return response.
      // Require previous TODO
      return response.created(
        responseFormatter(
          HTTP.CREATED,
          'success',
          'Create conversation translation node speech success',
          payload
        )
      )
    } catch (error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', error.message)
      )
    }
  }
}
