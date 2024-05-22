import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, afterFind, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { SocialProvider } from '../lib/constants/auth.js'
import StaticTranslation from './static_translation.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import env from '#start/env'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string | null

  @column()
  declare password: string | null

  @column()
  declare avatar: string | null

  @column()
  declare isSignUser: boolean

  @column()
  declare providers: SocialProvider | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => StaticTranslation, {
    foreignKey: 'userId',
    localKey: 'id',
  })
  declare staticTranslations: HasMany<typeof StaticTranslation>

  @afterFind()
  static convertAvatarToUrl(user: User) {
    if (user.avatar) {
      user.avatar = `${env.get('APP_URL')}/${env.get('DRIVE_NAME')}/avatar/${user.avatar}`
    }
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
