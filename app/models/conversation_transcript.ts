import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import ConversationNode from './conversation_node.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ConversationTranscript extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => ConversationNode)
  declare conversationNodeId: BelongsTo<typeof ConversationNode>

  @column()
  declare timestamp: string

  @column()
  declare text: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}