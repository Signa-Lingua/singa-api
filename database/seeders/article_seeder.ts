import Article from '#models/article'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    // Insert articles
    function createRandomArticle() {
      let articles = []
      for (let i = 0; i < 10; i++) {
        articles.push({
          title: 'Article ' + i,
          description: 'Description ' + i,
          imageUrl: 'https://www.example.com/image' + i + '.jpg',
        })
      }

      return articles
    }

    const articles = createRandomArticle()

    await Article.createMany([...articles])
  }
}
