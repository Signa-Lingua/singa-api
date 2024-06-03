// import type { HttpContext } from '@adonisjs/core/http'

import { HTTP } from '#lib/constants/http'
import Article from '#models/article'
import env from '#start/env'
import responseFormatter from '#utils/response_formatter'
import { articleUpdateValidator, articleValidator } from '#validators/article'
import { HttpContext } from '@adonisjs/core/http'

export default class ArticlesController {
  private admins = env
    .get('ADMINS')
    .split(',')
    .map((admin) => Number.parseInt(admin))

  async index() {
    const articles = await Article.query().orderBy('createdAt', 'desc')

    return responseFormatter(HTTP.OK, 'success', 'Get list of articles', articles)
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    if (!this.admins.includes(userId!)) {
      return response.forbidden(responseFormatter(HTTP.FORBIDDEN, 'error', 'Forbidden'))
    }

    const { title, description, imageUrl } = await request.validateUsing(articleValidator)

    try {
      // Create article
      const newArticle = await Article.create({
        title,
        description,
        imageUrl,
      })

      return response.created(
        responseFormatter(HTTP.CREATED, 'success', 'Create article success', newArticle.toJSON())
      )
    } catch (error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', error.message)
      )
    }
  }

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const articleId = params.id

    if (!this.admins.includes(userId!)) {
      return response.forbidden(responseFormatter(HTTP.FORBIDDEN, 'error', 'Forbidden'))
    }

    const { title, description, imageUrl } = await request.validateUsing(articleUpdateValidator)

    try {
      const targetedArticle = await Article.findBy('id', articleId)

      if (!targetedArticle) {
        return response.notFound(responseFormatter(HTTP.NOT_FOUND, 'error', 'Article not found'))
      }

      // Set new value or keep the old value if the new value is null or undefined
      targetedArticle.title = title || targetedArticle.title
      targetedArticle.description = description || targetedArticle.description
      targetedArticle.imageUrl = imageUrl || targetedArticle.imageUrl

      await targetedArticle.save()

      return response.ok(
        responseFormatter(HTTP.OK, 'success', 'Update article success', targetedArticle.toJSON())
      )
    } catch (error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', error.message)
      )
    }
  }

  async destroy({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const articleId = params.id

    if (!this.admins.includes(userId!)) {
      return response.forbidden(responseFormatter(HTTP.FORBIDDEN, 'error', 'Forbidden'))
    }

    try {
      const targetedArticle = await Article.findBy('id', articleId)

      if (!targetedArticle) {
        return response.notFound(responseFormatter(HTTP.NOT_FOUND, 'error', 'Article not found'))
      }

      await targetedArticle.delete()

      return response.ok(responseFormatter(HTTP.OK, 'success', 'Delete article success'))
    } catch (error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', error.message)
      )
    }
  }
}
