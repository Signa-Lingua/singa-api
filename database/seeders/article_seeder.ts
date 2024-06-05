import Article from '#models/article'
import Role from '#models/role'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const adminRole = await Role.findByOrFail('name', 'admin')
    const usersWithAdminRole = await User.query().where('roleId', adminRole.id).firstOrFail()

    // Insert articles
    function createRandomArticle() {
      let articles = []
      for (let i = 0; i < 10; i++) {
        articles.push({
          title: 'Article ' + i,
          description: 'Description ' + i,
          imageUrl: 'https://picsum.photos/200/300',
          createdBy: usersWithAdminRole.id,
        })
      }

      return articles
    }

    const articles = createRandomArticle()

    await Article.createMany([...articles])
  }
}
