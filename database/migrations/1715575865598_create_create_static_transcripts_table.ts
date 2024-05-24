import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'static_transcripts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table
        .integer('static_translation_id')
        .unsigned()
        .references('id')
        .inTable('static_translations')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.time('timestamp').notNullable().defaultTo('00:00:00.000')
      table.text('text').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // index
      table.index(['id'], 'static_transcripts_id_index')
      table.index(['static_translation_id'], 'static_transcripts_static_translation_id_index')
      table.index(['user_id'], 'static_transcripts_user_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
