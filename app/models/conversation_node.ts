import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { TranslationConversationNodeType } from '#lib/constants/translation'
import ConversationTranscript from './conversation_transcript.js'
import { Status } from '#lib/constants/status'

export default class ConversationNode extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare conversationTranslationId: number

  @column()
  declare userId: number

  @column()
  declare video: string | null

  @column()
  declare videoUrl: string | null

  @column()
  declare type: TranslationConversationNodeType

  @column()
  declare status: Status

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => ConversationTranscript, {
    localKey: 'id',
    foreignKey: 'conversationNodeId',
  })
  declare transcripts: HasMany<typeof ConversationTranscript>
}
