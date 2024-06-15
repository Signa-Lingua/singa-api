import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'session'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.text('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('expires_at')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // index
      table.index(['id'], 'sessions_id_index')
      table.index(['user_id'], 'sessions_user_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
