import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '../utils/response_formatter.js'
import { registerValidator } from '#validators/auth'
import * as nanoid from 'nanoid'
import Authentication from '#models/authentication'
import { updateUserValidator } from '#validators/user'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import { generateAvatarName } from '../utils/generator.js'
import { SocialProvider } from '../lib/constants/auth.js'
import hash from '@adonisjs/core/services/hash'
import { AccountType } from '../lib/constants/account_type.js'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.use('jwt').user?.id

    // return all execpt password
    const me = await User.query()
      .where('id', user!)
      .select(
        'id',
        'name',
        'email',
        'avatarUrl',
        'isSignUser',
        'accountType',
        'createdAt',
        'updatedAt'
      )
      .first()

    if (!me) {
      return response.notFound(responseFormatter(404, 'error', 'User not found'))
    }

    return response.ok(responseFormatter(200, 'success', 'Get user success', me))
  }

  /**
   * Display form to create a new record
   * this will handle guest user registration
   */
  async create({ auth, response }: HttpContext) {
    const user = await User.create({
      name: `Guest${nanoid.nanoid(16)}`,
      accountType: AccountType.GUEST,
    })

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

    return response.ok(responseFormatter(200, 'success', 'Login as guest success', token))
  }

  /**
   * Handle form submission for the create action
   * this will handle registering a new user
   */
  async store({ request, response }: HttpContext) {
    const { name, email, password } = await request.validateUsing(registerValidator)

    await User.create({
      name,
      email,
      password,
      providers: SocialProvider.PASSWORD,
      accountType: AccountType.DEFAULT,
    })

    return response.ok(responseFormatter(200, 'success', 'Register success'))
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, response, request }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const { name, password, isSignUser, avatar } = await request.validateUsing(updateUserValidator)

    const user = await User.query().where('id', userId!).first()

    if (!user) {
      return response.badRequest(responseFormatter(400, 'error', 'User not found'))
    }

    if (password) {
      if (user.password) {
        // compare old password with hashed password
        const isMatch = await hash.verify(user.password, password)

        if (isMatch) {
          return response.badRequest(
            responseFormatter(400, 'error', 'Old password cannot be same as new password')
          )
        }
      }

      user.password = await hash.make(password)
    }

    // if user update avatar
    if (avatar) {
      // check if old avatar exists
      if (user.avatar) {
        const result = await googleCloudStorageService.delete('avatar', user.avatar)

        if (result.error) {
          return response.internalServerError(responseFormatter(500, 'error', result.message, null))
        }
      }

      const generatedAvatarName = generateAvatarName(
        user.name,
        avatar.extname ? avatar.extname : 'jpg'
      )

      // save new avatar
      const fileName = await googleCloudStorageService.save(
        'avatar',
        avatar.tmpPath!,
        generatedAvatarName
      )

      if (fileName.error) {
        return response.internalServerError(responseFormatter(500, 'error', fileName.message, null))
      }

      user.avatar = generatedAvatarName
      user.avatarUrl = fileName.data
    }

    user.name = name ?? user.name
    user.isSignUser = isSignUser ?? user.isSignUser

    await user.save()

    const newUser = await User.query()
      .where('id', userId!)
      .select('id', 'name', 'email', 'avatarUrl', 'isSignUser', 'createdAt', 'updatedAt')
      .first()

    return response.ok(responseFormatter(200, 'success', 'Update user success', newUser))
  }
}
