import { HTTP } from '#lib/constants/http'
import ConversationNode from '#models/conversation_node'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import env from '#start/env'
import responseFormatter from '#utils/response_formatter'
import { bulkDeleteConversationNodeValidator } from '#validators/conversation_translation'
import type { HttpContext } from '@adonisjs/core/http'

export default class BulkDeleteConversationNodesController {
  /**
   * Delete record
   */
  async destroy({ auth, response, request }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const { id } = await request.validateUsing(bulkDeleteConversationNodeValidator)

    const conversationNodes = await ConversationNode.query()
      .where('user_id', userId!)
      .whereIn('id', id)

    for (const conversationNode of conversationNodes) {
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
    }

    return response.ok(responseFormatter(HTTP.OK, 'success', 'Delete conversation nodes success'))
  }
}
