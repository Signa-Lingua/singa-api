import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'test_queues'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('status')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // indexing
      table.index(['id'], 'test_queues_id_index')
      table.index(['name'], 'test_queues_name_index')
      table.index(['status'], 'test_queues_status_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
