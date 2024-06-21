import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conversation_transcripts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table
        .integer('conversation_node_id')
        .unsigned()
        .references('id')
        .inTable('conversation_nodes')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.text('timestamp').notNullable().defaultTo('00:00:00:000')
      table.text('text').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // index
      table.index(['id'], 'conversation_transcripts_id_index')
      table.index(['conversation_node_id'], 'conversation_transcripts_conversation_node_id_index')
      table.index(['user_id'], 'conversation_transcripts_user_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
