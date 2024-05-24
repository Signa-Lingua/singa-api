import StaticTranslation from '#models/static_translation'
import type { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '#utils/response_formatter'
import { staticTranslationValidator } from '#validators/static_translation'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import { generateFileName } from '#utils/generator'

export default class StaticTranslationsController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const staticTranslations = await StaticTranslation.query()
      .where('user_id', userId!)
      .select('id', 'title', 'videoUrl', 'createdAt', 'updatedAt')

    return response.ok(
      responseFormatter(200, 'success', 'Get list of static translations', staticTranslations)
    )
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, response, request }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const { title, file } = await request.validateUsing(staticTranslationValidator)

    // TODO: Request To Machine Learning Service

    const generatedFileName = generateFileName(userId!, file.extname ? file.extname : 'mp4')

    const fileUrl = await googleCloudStorageService.save(
      'static-translation',
      file.tmpPath!,
      generatedFileName
    )

    if (fileUrl.error) {
      return response.internalServerError(responseFormatter(500, 'error', fileUrl.message, null))
    }

    const staticTranslation = await StaticTranslation.create({
      title,
      videoUrl: fileUrl.data,
      userId,
    })
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
