import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conversation_nodes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table
        .integer('conversation_translation_id')
        .unsigned()
        .references('id')
        .inTable('conversation_translations')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('video').nullable()
      table.string('video_url').nullable()
      table.enum('status', ['pending', 'success', 'failed']).defaultTo('pending')
      table.enum('type', ['speech', 'video']).defaultTo('speech')

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.time

      // index
      table.index(['id'], 'conversation_nodes_id_index')
      table.index(
        ['conversation_translation_id'],
        'conversation_nodes_conversation_translation_id_index'
      )
      table.index(['user_id'], 'conversation_nodes_user_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
