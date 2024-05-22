import { SocialProvider } from '#lib/constants/auth'
import StaticTranscript from '#models/static_transcript'
import StaticTranslation from '#models/static_translation'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    // Insert user
    await User.createMany([
      // registered user
      {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'asdasdasd',
        providers: SocialProvider.PASSWORD,
      },
      // registered social user
      {
        name: 'Susan Doe',
        email: 'susandoe@gmail.com',
        password: null,
        providers: SocialProvider.GOOGLE,
      },
      // guest user
      {
        name: 'Mary Doe',
        email: null,
        password: null,
        providers: null,
      },
      // second guest user
      {
        name: 'Jane Doe',
        email: null,
        password: null,
        providers: null,
      },
    ])

    await StaticTranslation.createMany([
      {
        userId: 1,
        videoUrl: 'https://www.youtube.com/watch?v=123456',
      },
      {
        userId: 2,
        videoUrl: 'https://www.youtube.com/watch?v=123456',
      },
    ])

    await StaticTranscript.createMany([
      {
        staticTranslationId: 1,
        timestamp: '00:00:01',
        text: 'Hello, world!',
      },
      {
        staticTranslationId: 1,
        timestamp: '00:00:02',
        text: 'This is a test.',
      },
      {
        staticTranslationId: 2,
        timestamp: '00:00:01',
        text: 'Hello, world!',
      },
      {
        staticTranslationId: 2,
        timestamp: '00:00:02',
        text: 'This is a test.',
      }
    ])
  }
}