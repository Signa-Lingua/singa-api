import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'static_translations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('title').notNullable()
      table.string('video').nullable()
      table.string('video_url').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // index
      table.index(['id'], 'static_translations_id_index')
      table.index(['user_id'], 'static_translations_user_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
