import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import ConversationTranslation from './conversation_translation.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { ConversationNodeType } from '../../lib/constants/translation.js'
import ConversationTranscript from './conversation_transcript.js'

export default class ConversationNode extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => ConversationTranslation)
  declare conversationTranslationId: BelongsTo<typeof ConversationTranslation>

  @column()
  declare videoUrl: string | null

  @column()
  declare type: ConversationNodeType

  @hasMany(() => ConversationTranscript)
  declare transcripts: HasMany<typeof ConversationTranscript>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}