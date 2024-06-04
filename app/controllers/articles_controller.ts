// import type { HttpContext } from '@adonisjs/core/http'

import { HTTP } from '#lib/constants/http'
import Article from '#models/article'
import fileService from '#services/file_service'
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
    const articles = await Article.query().orderBy('created_at', 'asc')

    return responseFormatter(HTTP.OK, 'success', 'Get list of articles', articles)
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    if (!this.admins.includes(userId!)) {
      return response.forbidden(responseFormatter(HTTP.FORBIDDEN, 'error', 'Forbidden'))
    }

    const { title, description, image } = await request.validateUsing(articleValidator)

    const imageUrl = await fileService.save(image, 'article')

    try {
      // Create article
      const newArticle = await Article.create({
        title,
        description,
        imageUrl,
      })

      let mappedArticle = newArticle
      mappedArticle.imageUrl = `${env.get('APP_URL')}/uploads/article/${newArticle.imageUrl}`
      return response.created(
        responseFormatter(HTTP.CREATED, 'success', 'Create article success', mappedArticle)
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

    const { title, description, image } = await request.validateUsing(articleUpdateValidator)

    try {
      const targetedArticle = await Article.findBy('id', articleId)

      if (!targetedArticle) {
        return response.notFound(responseFormatter(HTTP.NOT_FOUND, 'error', 'Article not found'))
      }

      if (await fileService.isFileExists(targetedArticle.imageUrl, 'article')) {
        await fileService.delete(targetedArticle.imageUrl, 'article')
      }

      if (image) {
        targetedArticle.imageUrl = await fileService.save(image, 'article')
      }

      // Set new value or keep the old value if the new value is null or undefined
      targetedArticle.title = title || targetedArticle.title
      targetedArticle.description = description || targetedArticle.description

      await targetedArticle.save()

      // rename targetedArticle.imageUrl to ${APP_URL}/${targetedArticle.imageUrl}

      let mappedArticle = targetedArticle
      mappedArticle.imageUrl = `${env.get('APP_URL')}/uploads/article/${targetedArticle.imageUrl}`

      return response.ok(
        responseFormatter(HTTP.OK, 'success', 'Update article success', mappedArticle)
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
