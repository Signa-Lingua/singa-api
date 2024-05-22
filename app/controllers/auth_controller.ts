import User from '#models/user'
import { loginValidator, refreshTokenValidator, updateAccessTokenValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '../utils/response_formatter.js'
import Authentication from '#models/authentication'

export default class AuthController {
  /**
   * Display form to create a new record
   */
  async create({ auth, request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    const token = await auth.use('jwt').generateWithRefreshToken(user)

    const oldToken = await Authentication.query().where('owner_id', user.id).first()

    if (oldToken) {
      oldToken.token = token.refreshToken
      await oldToken.save()
    } else {
      await Authentication.create({
        token: token.refreshToken,
        ownerId: user.id,
      })
    }

    return response.ok(responseFormatter(200, 'success', 'Login success', token))
  }

  /**
   * Handle form submission for the edit action
   * this will handle updating access token
   */
  async update({ auth, request, response }: HttpContext) {
    const { token } = await request.validateUsing(updateAccessTokenValidator)

    const user = await auth.use('jwt').getUserByToken(token)

    const newToken = await auth.use('jwt').generate(user)

    return response.ok(responseFormatter(200, 'success', 'Update access token success', newToken))
  }

  /**
   * Delete record
   * delete refresh token
   */
  async destroy({ auth, response, request }: HttpContext) {
    const user = auth.use('jwt').user?.id

    const { refreshToken } = await request.validateUsing(refreshTokenValidator)

    const token = await Authentication.query()
      .where('token', refreshToken)
      .andWhere('owner_id', user!)
      .first()

    if (!token) {
      return response.badRequest(responseFormatter(400, 'error', 'Invalid refresh token'))
    }

    await token.delete()

    return response.ok(responseFormatter(200, 'success', 'Logout success'))
  }
}
