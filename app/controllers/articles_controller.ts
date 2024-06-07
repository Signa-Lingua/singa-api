// import type { HttpContext } from '@adonisjs/core/http'

import { HTTP } from '#lib/constants/http'
import Article from '#models/article'
import ArticlePolicy from '#policies/article_policy'
import fileService from '#services/file_service'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import responseFormatter from '#utils/response_formatter'
import { articleUpdateValidator, articleValidator } from '#validators/article'
import { HttpContext } from '@adonisjs/core/http'
import * as nano from 'nanoid'

export default class ArticlesController {
  async index() {
    const articles = await Article.query()
      .orderBy('created_at', 'asc')
      .preload('user', (query) => {
        query.select('id', 'name', 'email', 'roleId')
        query.preload('role')
      })

    return responseFormatter(HTTP.OK, 'success', 'Get list of articles', articles)
  }

  async show({ params, response }: HttpContext) {
    const targetedArticle = await Article.query()
      .where('id', params.id)
      .preload('user', (query) => {
        query.select('id', 'name', 'email', 'roleId', 'avatarUrl')
        query.preload('role')
      })
      .first()

    if (!targetedArticle) {
      return response.notFound(responseFormatter(HTTP.NOT_FOUND, 'error', 'Article not found'))
    }

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'Get article success', targetedArticle)
    )
  }

  async store({ auth, bouncer, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    if (await bouncer.with(ArticlePolicy).denies('create')) {
      return response.forbidden(responseFormatter(HTTP.FORBIDDEN, 'error', 'Forbidden'))
    }

    const { title, description, image } = await request.validateUsing(articleValidator)

    const imageUrl = await googleCloudStorageService.save(
      'article',
      image.tmpPath!,
      `article-${nano.nanoid(16)}.${image.extname}`
    )

    if (imageUrl.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', imageUrl.message)
      )
    }

    try {
      // Create article
      const newArticle = await Article.create({
        title,
        description,
        imageUrl: imageUrl.data,
        createdBy: userId,
      })

      return response.created(
        responseFormatter(HTTP.CREATED, 'success', 'Create article success', newArticle)
      )
    } catch (error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', error.message)
      )
    }
  }

  async update({ bouncer, params, request, response }: HttpContext) {
    if (await bouncer.with(ArticlePolicy).denies('update')) {
      return response.forbidden(responseFormatter(HTTP.FORBIDDEN, 'error', 'Forbidden'))
    }

    const articleId = params.id

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
        if (targetedArticle.imageUrl) {
          const imageUrl = await googleCloudStorageService.delete(
            'article',
            targetedArticle.imageUrl
          )

          if (imageUrl.error) {
            return response.internalServerError(
              responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', imageUrl.message)
            )
          }
        }

        const imageUrl = await googleCloudStorageService.save(
          'article',
          image.tmpPath!,
          `article-${nano.nanoid(16)}.${image.extname}`
        )

        if (imageUrl.error) {
          return response.internalServerError(
            responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', imageUrl.message)
          )
        }

        targetedArticle.imageUrl = imageUrl.data
      }

      // Set new value or keep the old value if the new value is null or undefined
      targetedArticle.title = title || targetedArticle.title
      targetedArticle.description = description || targetedArticle.description

      await targetedArticle.save()

      await targetedArticle.load('user', (query) => {
        query.select('id', 'name', 'email', 'roleId')
        query.preload('role')
      })

      // rename targetedArticle.imageUrl to ${APP_URL}/${targetedArticle.imageUrl}

      return response.ok(
        responseFormatter(HTTP.OK, 'success', 'Update article success', targetedArticle)
      )
    } catch (error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', error.message)
      )
    }
  }

  async destroy({ bouncer, params, response }: HttpContext) {
    if (await bouncer.with(ArticlePolicy).denies('delete')) {
      return response.forbidden(responseFormatter(HTTP.FORBIDDEN, 'error', 'Forbidden'))
    }

    const articleId = params.id

    try {
      const targetedArticle = await Article.findBy('id', articleId)

      if (!targetedArticle) {
        return response.notFound(responseFormatter(HTTP.NOT_FOUND, 'error', 'Article not found'))
      }

      if (targetedArticle.imageUrl) {
        const fileName = targetedArticle.imageUrl.split('/').pop()

        const imageUrl = await googleCloudStorageService.delete('article', fileName!)

        if (imageUrl.error) {
          return response.internalServerError(
            responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', imageUrl.message)
          )
        }
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
