import type { HttpContext } from '@adonisjs/core/http'

export default class TranscriptStaticsController {
  /**
   * Show individual record
   */
  async show({ auth, response, params }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
