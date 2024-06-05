import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // index
      table.index(['id'], 'roles_id_index')
      table.index(['name'], 'roles_name_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
