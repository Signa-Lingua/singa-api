import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_permissons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // index
      table.index(['id'], 'role_permissons_id_index')
      table.index(['role_id'], 'role_permissons_role_id_index')
      table.index(['permission_id'], 'role_permissons_permission_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
