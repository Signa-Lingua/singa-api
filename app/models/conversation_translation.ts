import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ConversationNode from './conversation_node.js'

export default class ConversationTranslation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ownerId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => ConversationNode, {
    localKey: 'id',
    foreignKey: 'conversationTranslationId',
  })
  declare conversationNodes: HasMany<typeof ConversationNode>
}
