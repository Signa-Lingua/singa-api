import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { SocialProvider } from '#lib/constants/auth'
import responseFormatter from '#utils/response_formatter'
import Authentication from '#models/authentication'

export default class GithubAuthsController {
  /**
   * Display a list of resource
   * this will handle redirecting to github
   */
  async index({ ally }: HttpContext) {
    return ally.use('github').redirect()
  }

  /**
   * Handle form submission for the create action
   * this will handle creating user with github
   */
  async store({ ally, auth, response }: HttpContext) {
    const gh = ally.use('github')

    if (gh.accessDenied()) {
      return response.unauthorized(responseFormatter(401, 'error', 'Unauthorized access'))
    }

    if (gh.stateMisMatch()) {
      return response.badRequest(responseFormatter(400, 'error', 'State mis-match'))
    }

    if (gh.hasError()) {
      const error = gh.getError()
      return response.badRequest(responseFormatter(400, 'error', error ?? 'Unknown error'))
    }

    const ghUser = await gh.user()

    const user = await User.firstOrCreate(
      {
        email: ghUser.email,
      },
      {
        name: ghUser.name,
        avatarUrl: ghUser.avatarUrl,
        email: ghUser.email,
        providers: SocialProvider.GITHUB,
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

    return response.ok(responseFormatter(200, 'success', 'Login success', token))
  }
}
