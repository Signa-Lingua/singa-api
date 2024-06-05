import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class ArticlePolicy extends BasePolicy {
  async create(user: User): Promise<boolean> {
    let isAllowed = false

    await user.load('role')

    if (user.role.name === 'admin') {
      isAllowed = true
    }

    return isAllowed
  }

  async update(user: User): Promise<boolean> {
    let isAllowed = false

    await user.load('role')

    if (user.role.name === 'admin') {
      isAllowed = true
    }

    return isAllowed
  }

  async delete(user: User): Promise<boolean> {
    let isAllowed = false

    await user.load('role')

    if (user.role.name === 'admin') {
      isAllowed = true
    }

    return isAllowed
  }
}
