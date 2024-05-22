import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conversation_nodes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.integer('conversation_translation_id').unsigned().references('id').inTable('conversation_translations').onDelete('CASCADE')
      table.string('video_url').nullable()
      table.enum('type', ['speech', 'video']).defaultTo('speech')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}