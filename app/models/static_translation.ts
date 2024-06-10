import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import StaticTranscript from './static_transcript.js'
import { Status } from '#lib/constants/status'

export default class StaticTranslation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare title: string

  // TODO: Temporary solution. Remove null after implementation
  @column()
  declare video: string | null

  @column()
  declare videoUrl: string

  @column()
  declare status: Status

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => StaticTranscript, {
    foreignKey: 'staticTranslationId',
    localKey: 'id',
  })
  declare transcripts: HasMany<typeof StaticTranscript>
}
