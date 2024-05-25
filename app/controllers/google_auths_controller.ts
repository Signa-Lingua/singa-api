import type { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '#utils/response_formatter'
import User from '#models/user'
import Authentication from '#models/authentication'
import { SocialProvider } from '#lib/constants/auth'
import { HTTP } from '#lib/constants/http'

export default class GoogleAuthsController {
  /**
   * Display a list of resource
   */
  async index({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ ally, auth, response }: HttpContext) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      return response.unauthorized(responseFormatter(401, 'error', 'Unauthorized access'))
    }

    if (google.stateMisMatch()) {
      return response.badRequest(responseFormatter(HTTP.BAD_REQUEST, 'error', 'State mis-match'))
    }

    if (google.hasError()) {
      const error = google.getError()
      return response.badRequest(
        responseFormatter(HTTP.BAD_REQUEST, 'error', error ?? 'Unknown error')
      )
    }

    const googleUser = await google.user()

    const user = await User.firstOrCreate(
      {
        email: googleUser.email,
      },
      {
        name: googleUser.name,
        avatarUrl: googleUser.avatarUrl,
        email: googleUser.email,
        providers: SocialProvider.GOOGLE,
      }
    )

    const token = await auth.use('jwt').generateWithRefreshToken(user)

    const oldToken = await Authentication.query().where('user_id', user.id).first()

    if (oldToken) {
      oldToken.token = token.refreshToken
      await oldToken.save()
    } else {
      await Authentication.create({
        token: token.refreshToken,
        userId: user.id,
      })
    }

    return response.ok(responseFormatter(HTTP.OK, 'success', 'Login success', token))
  }
}
