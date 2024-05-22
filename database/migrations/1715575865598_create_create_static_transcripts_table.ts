import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'static_transcripts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.integer('static_translation_id').unsigned().references('id').inTable('static_translations').onDelete('CASCADE')
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