import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '../utils/response_formatter.js'
import { registerValidator } from '#validators/auth'
import * as nanoid from 'nanoid'
import Authentication from '#models/authentication'
import { updateUserValidator } from '#validators/user'
import fileService from '#services/file_service'
import { TFileServiceResult } from '../types/FileService.js'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.use('jwt').user?.id

    // return all execpt password
    const me = await User.query()
      .where('id', user!)
      .select('id', 'name', 'email', 'avatar', 'isSignUser', 'createdAt', 'updatedAt')
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
    const { name, email, password, providers } = await request.validateUsing(registerValidator)

    await User.create({
      name,
      email,
      password,
      providers,
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

    let isAvatarFileExist: TFileServiceResult = {
      error: false,
      message: '',
    }

    // if user update avatar
    if (avatar) {
      // check if old avatar exists
      if (user.avatar) {
        const splitAvatar = user.avatar.split('/').pop()
        isAvatarFileExist = await fileService.isFileExists(splitAvatar!, 'avatar')

        // if old avatar exists
        if (isAvatarFileExist.error === false) {
          // delete old avatar
          await fileService.delete(splitAvatar!, 'avatar')
        } else {
          // return error message
          return response.badRequest(responseFormatter(400, 'error', isAvatarFileExist.message))
        }
      }

      // save new avatar
      const fileName = await fileService.save(avatar, 'avatar')
      user.avatar = fileName
    }

    user.name = name ?? user.name
    user.isSignUser = isSignUser ?? user.isSignUser
    user.password = password ?? user.password
    await user.save()

    const newUser = await User.query()
      .where('id', userId!)
      .select('id', 'name', 'email', 'avatar', 'isSignUser', 'createdAt', 'updatedAt')
      .first()

    return response.ok(responseFormatter(200, 'success', 'Update user success', newUser))
  }
}
