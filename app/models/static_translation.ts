import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import StaticTranscript from './static_transcript.js'

export default class StaticTranslation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare videoUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => StaticTranscript, {
    foreignKey: 'staticTranslationId',
    localKey: 'id',
  })
  declare staticTranscripts: HasMany<typeof StaticTranscript>
}
