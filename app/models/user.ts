import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { SocialProvider } from '#lib/constants/auth'
import StaticTranslation from './static_translation.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import ConversationTranslation from './conversation_translation.js'
import Role from './role.js'

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
  declare avatarUrl: string | null

  @column()
  declare isSignUser: boolean

  @column()
  declare provider: SocialProvider | null

  @column()
  declare roleId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => StaticTranslation, {
    foreignKey: 'userId',
    localKey: 'id',
  })
  declare staticTranslations: HasMany<typeof StaticTranslation>

  @hasMany(() => ConversationTranslation, {
    foreignKey: 'userId',
    localKey: 'id',
  })
  declare conversationTranslations: HasMany<typeof ConversationTranslation>

  @hasOne(() => Role, {
    foreignKey: 'id',
    localKey: 'roleId',
  })
  declare role: HasOne<typeof Role>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
