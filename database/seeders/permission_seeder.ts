import Permission from '#models/permission'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    await Permission.createMany([
      { name: 'read' },
      { name: 'write' },
      { name: 'delete' },
      { name: 'update' },
    ])
  }
}
