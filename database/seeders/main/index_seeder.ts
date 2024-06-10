/* eslint-disable unicorn/no-await-expression-member */
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class IndexSeeder extends BaseSeeder {
  async run() {
    // https://lucid.adonisjs.com/docs/seeders#customizing-seeders-order
    await new (await import('#database/seeders/role_seeder')).default(this.client).run()
    await new (await import('#database/seeders/permission_seeder')).default(this.client).run()
    await new (await import('#database/seeders/role_permission_seeder')).default(this.client).run()
    await new (await import('#database/seeders/initial_seed_seeder')).default(this.client).run()
  }
}
