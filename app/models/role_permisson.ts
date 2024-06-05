import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Role from './role.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Permission from './permission.js'

export default class RolePermisson extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: number

  @column()
  declare permissionId: number

  @hasOne(() => Role, {
    foreignKey: 'id',
    localKey: 'roleId',
  })
  declare role: HasOne<typeof Role>

  @hasOne(() => Permission, {
    foreignKey: 'id',
    localKey: 'permissionId',
  })
  declare permission: HasOne<typeof Permission>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
