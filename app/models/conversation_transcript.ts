import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ConversationTranscript extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare conversationNodeId: number

  @column()
  declare userId: number

  @column()
  declare timestamp: string

  @column()
  declare text: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
