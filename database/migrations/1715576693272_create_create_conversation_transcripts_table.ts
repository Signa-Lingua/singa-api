import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conversation_transcripts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.integer('conversation_node_id').unsigned().references('id').inTable('conversation_nodes').onDelete('CASCADE')
      table.time('timestamp').notNullable().defaultTo('00:00:00')
      table.text('text').notNullable()


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}