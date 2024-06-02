import { HTTP } from '#lib/constants/http'
import ConversationTranslation from '#models/conversation_translation'
import StaticTranslation from '#models/static_translation'
import User from '#models/user'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import env from '#start/env'
import responseFormatter from '#utils/response_formatter'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { DateTime } from 'luxon'

export default class DeleteOldTranslationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Older than 7 days
    const olderThan = DateTime.now().minus({ days: 7 }).toSQL()

    const guests = await User.query().whereNull('provider')
    const oldStaticTranslations = await StaticTranslation.query()
      .where('createdAt', '<', olderThan)
      .whereIn(
        'userId',
        guests.map((guest) => guest.id)
      )
    const oldConversationTranslations = await ConversationTranslation.query()
      .preload('conversationNodes', (query) => {
        query.select('id', 'video')
      })
      .where('createdAt', '<', olderThan)
      .whereIn(
        'userId',
        guests.map((guest) => guest.id)
      )

    try {
      oldStaticTranslations.forEach(async (translation) => {
        if (translation.video) {
          const fileDelete = await googleCloudStorageService.delete(
            env.get('STATIC_STORAGE_PATH'),
            translation.video
          )

          if (fileDelete.error) {
            return ctx.response.internalServerError(
              responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', fileDelete.message)
            )
          }
        }
        await translation.delete()
      })

      oldConversationTranslations.forEach(async (translation) => {
        translation.conversationNodes.forEach(async (node) => {
          if (node.video) {
            const fileDelete = await googleCloudStorageService.delete(
              env.get('CONVERSATION_STORAGE_PATH'),
              node.video
            )

            if (fileDelete.error) {
              return ctx.response.internalServerError(
                responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', fileDelete.message)
              )
            }
          }
        })
        await translation.delete()
      })
    } catch (error) {
      return ctx.response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', error.message)
      )
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
