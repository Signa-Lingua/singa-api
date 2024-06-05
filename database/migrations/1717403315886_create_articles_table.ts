import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.string('image_url').notNullable()
      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // index
      table.index(['id'], 'articles_id_index')
      table.index(['created_by'], 'articles_created_by_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
