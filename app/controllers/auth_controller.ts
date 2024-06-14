import User from '#models/user'
import { loginValidator, refreshTokenValidator, updateAccessTokenValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '#utils/response_formatter'
import Authentication from '#models/authentication'
import { HTTP } from '#lib/constants/http'

export default class AuthController {
  /**
   * Display form to create a new record
   */
  async create({ auth, request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    const token = await auth.use('jwt').generateWithRefreshToken(user)

    // const oldToken = await Authentication.query().where('user_id', user.id).first()

    await Authentication.create({
      token: token.refreshToken,
      userId: user.id,
    })

    return response.ok(responseFormatter(HTTP.OK, 'success', 'Login success', token))
  }

  /**
   * Handle form submission for the edit action
   * this will handle updating access token
   */
  async update({ auth, request, response }: HttpContext) {
    const { token } = await request.validateUsing(updateAccessTokenValidator)

    const user = await auth.use('jwt').getUserByToken(token)

    const newToken = await auth.use('jwt').generate(user)

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'Update access token success', newToken)
    )
  }

  /**
   * Delete record
   * delete refresh token
   */
  async destroy({ response, request }: HttpContext) {
    const { refreshToken } = await request.validateUsing(refreshTokenValidator)

    const token = await Authentication.query().where('token', refreshToken).first()

    if (!token) {
      return response.badRequest(
        responseFormatter(HTTP.BAD_REQUEST, 'error', 'Invalid refresh token')
      )
    }

    await token.delete()

    return response.ok(responseFormatter(HTTP.OK, 'success', 'Logout success'))
  }
}
