import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as coreError } from '@adonisjs/core'
import { errors as authError } from '@adonisjs/auth'
import { errors as dbError } from '@adonisjs/lucid'
import responseFormatter from '#utils/response_formatter'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof authError.E_INVALID_CREDENTIALS) {
      return ctx.response.badRequest(
        responseFormatter(
          HTTP.BAD_REQUEST,
          'error',
          'Unable to find user with provided credentials'
        )
      )
    }

    if (error instanceof authError.E_UNAUTHORIZED_ACCESS) {
      return ctx.response.unauthorized(responseFormatter(401, 'error', 'Unauthorized access'))
    }

    if (error instanceof coreError.E_ROUTE_NOT_FOUND) {
      return ctx.response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Route not found, please check the URL')
      )
    }

    if (error instanceof dbError.E_ROW_NOT_FOUND) {
      return ctx.response.notFound(
        responseFormatter(HTTP.NOT_FOUND, 'error', 'Record not found, please check the params')
      )
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
