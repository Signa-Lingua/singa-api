import { HTTP } from '#lib/constants/http'
import ConversationNode from '#models/conversation_node'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import env from '#start/env'
import responseFormatter from '#utils/response_formatter'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConversationNodesController {
  /**
   * Show individual record
   */
  async show({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const conversationNode = await ConversationNode.query()
      .where('user_id', userId!)
      .where('conversation_translation_id', params.id)
      .preload('transcripts', (query) => {
        query.orderBy('created_at', 'asc')
      })

    let mappedConversationNode = conversationNode.map((node) => {
      return {
        ...node.$attributes,
        transcripts: node.transcripts.map((transcript) => transcript.text).join(' '),
      }
    })

    if (!mappedConversationNode) {
      return response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Conversation node not found')
      )
    }

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'Get conversation node success', mappedConversationNode)
    )
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const conversationNode = await ConversationNode.query()
      .where('user_id', userId!)
      .where('conversation_translation_id', params.id)
      .where('id', params.id)
      .first()

    if (!conversationNode) {
      return response.notFound(
        responseFormatter(HTTP.BAD_REQUEST, 'error', 'Conversation node not found')
      )
    }

    if (conversationNode.video !== null) {
      await googleCloudStorageService.delete(
        env.get('CONVERSATION_STORAGE_PATH'),
        conversationNode.video
      )
    }

    const transcripts = await conversationNode.related('transcripts').query()

    for (const transcript of transcripts) {
      await transcript.delete()
    }

    await conversationNode.delete()

    return response.ok(responseFormatter(HTTP.OK, 'success', 'Delete conversation node success'))
  }
}
