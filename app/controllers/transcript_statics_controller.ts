import { HTTP } from '#lib/constants/http'
import StaticTranscript from '#models/static_transcript'
import responseFormatter from '#utils/response_formatter'
import type { HttpContext } from '@adonisjs/core/http'

export default class TranscriptStaticsController {
  /**
   * Show individual record
   */
  async show({ auth, response, params }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const transcriptStatic = await StaticTranscript.query()
      .where('user_id', userId!)
      .where('staticTranslationId', params.id)

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'Get transcript success', transcriptStatic)
    )
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const transcriptStatic = await StaticTranscript.query()
      .where('user_id', userId!)
      .where('staticTranslationId', params.staticTranslationId)
      .where('id', params.id)
      .first()

    if (!transcriptStatic) {
      return response.notFound(responseFormatter(HTTP.BAD_REQUEST, 'error', 'Transcript not found'))
    }

    await transcriptStatic.delete()

    return response.ok(responseFormatter(HTTP.OK, 'success', 'Delete transcript success'))
  }
}
