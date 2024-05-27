import type { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '#utils/response_formatter'
import {
  conversationTranslationValidator,
  conversationNodeSpeechValidator,
  conversationNodeVideoValidator,
} from '#validators/conversation_translation'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import { generateFileName } from '#utils/generator'
import { HTTP } from '#lib/constants/http'
import ConversationTranslation from '#models/conversation_translation'
import ConversationNode from '#models/conversation_node'

export default class ConversationTranslationsController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const conversationTranslations = await ConversationTranslation.query()
      .where('user_id', userId!)
      .select('id', 'title', 'createdAt', 'updatedAt')

    return response.ok(
      responseFormatter(
        HTTP.OK,
        'success',
        'Get list of conversation translations',
        conversationTranslations
      )
    )
  }

  /**
   * Handle form submission for the create action
   */
  async create({ auth, response, request }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const { title } = await request.validateUsing(conversationTranslationValidator)

    const conversationTranslation = await ConversationTranslation.create({
      title,
      userId,
    })

    return response.created(
      responseFormatter(
        HTTP.CREATED,
        'success',
        'Create conversation translation success',
        conversationTranslation
      )
    )
  }

  /**
   * Handle form submission for the create action
   */
  async createNodeVideo({ auth, params, request, response }: HttpContext) {
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

  /**
   * Handle form submission for the create action
   */
  async createNodeSpeech({ auth, params, request, response }: HttpContext) {
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

  /**
   * Show individual record
   */
  async show({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const conversationTranslations = await ConversationTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .select('id', 'title', 'createdAt', 'updatedAt')
      .preload('conversationNodes', (query) =>
        query
          .orderBy('createdAt', 'desc')
          .preload('transcripts', (q2) => q2.orderBy('createdAt', 'desc'))
      )
      .first()

    if (!conversationTranslations) {
      return response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Conversation translation not found')
      )
    }

    return response.ok(
      responseFormatter(
        HTTP.OK,
        'success',
        'Conversation translation found',
        conversationTranslations
      )
    )
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const { title } = await request.validateUsing(conversationTranslationValidator)

    const conversationTranslation = await ConversationTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .first()

    if (!conversationTranslation) {
      return response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Conversation translation not found')
      )
    }

    conversationTranslation.title = title

    await conversationTranslation.save()

    return response.ok(
      responseFormatter(
        HTTP.OK,
        'success',
        'Update conversation translation success',
        conversationTranslation
      )
    )
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const conversationTranslation = await ConversationTranslation.query()
      .where('user_id', userId!)
      .where('id', params.id)
      .first()

    if (!conversationTranslation) {
      return response.notFound(
        responseFormatter(HTTP.BAD_REQUEST, 'error', 'Conversation translation not found')
      )
    }

    await conversationTranslation.delete()

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'Delete conversation translation success')
    )
  }
}
