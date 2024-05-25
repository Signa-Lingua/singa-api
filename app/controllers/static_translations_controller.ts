import StaticTranslation from '#models/static_translation'
import type { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '#utils/response_formatter'
import {
  staticTranslationUpdateValidator,
  staticTranslationValidator,
} from '#validators/static_translation'
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

    return response.created(
      responseFormatter(201, 'success', 'Create static translation success', staticTranslation)
    )
  }

  /**
   * Show individual record
   */
  async show({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const staticTranslations = await StaticTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .select('id', 'title', 'videoUrl', 'createdAt', 'updatedAt')
      .first()

    if (!staticTranslations) {
      return response.notFound(responseFormatter(404, 'error', 'Static translation not found'))
    }

    return response.ok(
      responseFormatter(200, 'success', 'Static translation found', staticTranslations)
    )
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const { title } = await request.validateUsing(staticTranslationUpdateValidator)

    const staticTranslation = await StaticTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .first()

    if (!staticTranslation) {
      return response.notFound(responseFormatter(404, 'error', 'Static translation not found'))
    }

    staticTranslation.title = title

    await staticTranslation.save()

    return response.ok(
      responseFormatter(200, 'success', 'Update static translation success', staticTranslation)
    )
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const staticTranslation = await StaticTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .first()

    if (!staticTranslation) {
      return response.notFound(responseFormatter(400, 'error', 'Static translation not found'))
    }

    await staticTranslation.delete()

    return response.ok(responseFormatter(200, 'success', 'Delete static translation success'))
  }
}
