import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import responseFormatter from '#utils/response_formatter'
import Authentication from '#models/authentication'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    /**
     * Ensure the auth header exists
     */
    const authHeader = ctx.request.header('authorization')
    if (!authHeader) {
      return ctx.response.unauthorized(responseFormatter(401, 'error', 'Unauthorized access'))
    }

    /**
     * Split the header value and read the token from it
     */
    const [, token] = authHeader.split('Bearer ')
    if (!token) {
      return ctx.response.unauthorized(responseFormatter(401, 'error', 'Unauthorized access'))
    }

    try {
      const user = await ctx.auth.use('jwt').getUserByExpiredToken(token)

      const newToken = await Authentication.findBy('userId', user.id)

      if (!newToken) {
        return ctx.response.unauthorized(responseFormatter(401, 'error', 'Unauthorized access'))
      }

      ctx.request.request.headers['authorization'] = `Bearer ${newToken.token}`
    } catch (error) {
      return ctx.response.unauthorized(responseFormatter(401, 'error', error.message))
    }

    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    return next()
  }
}
