import { SocialProvider } from '#lib/constants/auth'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.string('name').nullable()
      table.string('email', 254).nullable().unique()
      table.string('password').nullable()
      table.string('avatar').nullable()
      table.string('avatar_url').nullable()
      table.boolean('is_sign_user').defaultTo(false)
      table.enum('provider', Object.values(SocialProvider)).nullable()
      table.integer('role_id').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // index
      table.index(['id'], 'users_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
