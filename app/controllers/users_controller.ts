import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '#utils/response_formatter'
import { registerValidator } from '#validators/auth'
import * as nanoid from 'nanoid'
import Authentication from '#models/authentication'
import { updateUserValidator } from '#validators/user'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import { generateAvatarName } from '#utils/generator'
import { SocialProvider } from '#lib/constants/auth'
import hash from '@adonisjs/core/services/hash'
import { HTTP } from '#lib/constants/http'
import env from '#start/env'
import Role from '#models/role'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id
    const isGuest = auth.use('jwt').user?.provider === null

    // return all execpt password
    const me = await User.query()
      .where('id', userId!)
      .select('id', 'name', 'email', 'avatarUrl', 'isSignUser', 'roleId', 'createdAt', 'updatedAt')
      .preload('role')
      .first()

    if (!me) {
      return response.notFound(responseFormatter(HTTP.NOT_FOUND, 'error', 'User not found'))
    }

    const usedQuota = await googleCloudStorageService.getUserUsedQuota(userId!)

    if (usedQuota.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', usedQuota.message)
      )
    }

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'Get user success', {
        ...me.toJSON(),
        quota: {
          used: usedQuota.data,
          quota: isGuest ? env.get('GUEST_QUOTA') : env.get('USER_QUOTA'),
        },
      })
    )
  }

  /**
   * Display form to create a new record
   * this will handle guest user registration
   */
  async create({ auth, response }: HttpContext) {
    const defaultRole = await Role.query().where('name', 'user').first()

    if (!defaultRole) {
      return response.badRequest(
        responseFormatter(HTTP.BAD_REQUEST, 'error', 'Role not found or not created yet')
      )
    }

    const user = await User.create({
      name: `Guest${nanoid.nanoid(16).replace(/[^a-zA-Z]/g, '')}`,
      roleId: defaultRole.id,
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

    return response.ok(responseFormatter(HTTP.OK, 'success', 'Login as guest success', token))
  }

  /**
   * Handle form submission for the create action
   * this will handle registering a new user
   */
  async store({ request, response }: HttpContext) {
    const { name, email, password } = await request.validateUsing(registerValidator)

    const defaultRole = await Role.query().where('name', 'user').first()

    if (!defaultRole) {
      return response.badRequest(
        responseFormatter(HTTP.BAD_REQUEST, 'error', 'Role not found or not created yet')
      )
    }

    await User.create({
      name,
      email,
      password,
      provider: SocialProvider.PASSWORD,
      roleId: defaultRole.id,
    })

    return response.ok(responseFormatter(HTTP.OK, 'success', 'Register success'))
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, response, request }: HttpContext) {
    const userId = auth.use('jwt').user?.id
    const isGuest = auth.use('jwt').user?.provider === null

    const { name, email, password, isSignUser, avatar } =
      await request.validateUsing(updateUserValidator)

    const user = await User.query().where('id', userId!).first()

    if (!user) {
      return response.badRequest(responseFormatter(HTTP.BAD_REQUEST, 'error', 'User not found'))
    }

    if (password) {
      if (user.password) {
        // compare old password with hashed password
        const isMatch = await hash.verify(user.password, password)

        if (isMatch) {
          return response.badRequest(
            responseFormatter(
              HTTP.BAD_REQUEST,
              'error',
              'Old password cannot be same as new password'
            )
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
          return response.internalServerError(
            responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', result.message, null)
          )
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
        return response.internalServerError(
          responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', fileName.message, null)
        )
      }

      user.avatar = generatedAvatarName
      user.avatarUrl = fileName.data
    }

    user.name = name ?? user.name
    user.email = email ?? user.email
    user.isSignUser = isSignUser ?? user.isSignUser

    await user.save()

    const usedQuota = await googleCloudStorageService.getUserUsedQuota(userId!)

    if (usedQuota.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', usedQuota.message)
      )
    }

    const newUser = await User.query()
      .where('id', userId!)
      .select('id', 'name', 'email', 'avatarUrl', 'isSignUser', 'roleId', 'createdAt', 'updatedAt')
      .preload('role')
      .first()

    if (!newUser) {
      return response.badRequest(responseFormatter(HTTP.BAD_REQUEST, 'error', 'User not found'))
    }

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'Get user success', {
        ...newUser.toJSON(),
        quota: {
          used: usedQuota.data,
          quota: isGuest ? env.get('GUEST_QUOTA') : env.get('USER_QUOTA'),
        },
      })
    )
  }
}
