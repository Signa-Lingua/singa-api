import { SocialProvider } from '../../app/lib/constants/auth.js'
import StaticTranscript from '#models/static_transcript'
import StaticTranslation from '#models/static_translation'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ConversationTranslation from '#models/conversation_translation'
import ConversationNode from '#models/conversation_node'
import { TranslationConversationNodeType } from '../../app/lib/constants/translation.js'
import ConversationTranscript from '#models/conversation_transcript'

export default class extends BaseSeeder {
  async run() {
    // Insert user
    await User.createMany([
      // registered user
      {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'asdasdasd',
        providers: SocialProvider.PASSWORD,
        isSignUser: true,
      },
      // registered social user
      {
        name: 'Susan Doe',
        email: 'susandoe@gmail.com',
        password: null,
        providers: SocialProvider.GOOGLE,
        isSignUser: false,
      },
      // guest user
      {
        name: 'Mary Doe',
        email: null,
        password: null,
        providers: null,
        isSignUser: true,
      },
      // second guest user
      {
        name: 'Jane Doe',
        email: null,
        password: null,
        providers: null,
        isSignUser: false,
      },
    ])

    const staticTranslation = [
      {
        userId: 1,
        title: 'First Static Translation for userid 1',
        videoUrl: 'https://www.youtube.com/watch?v=123456',
      },
      {
        userId: 1,
        title: 'Second Static Translation for userid 1',
        videoUrl: 'https://www.youtube.com/watch?v=123456',
      },
      {
        userId: 2,
        title: 'First Static Translation for userid 2',
        videoUrl: 'https://www.youtube.com/watch?v=123456',
      },
    ]

    await StaticTranslation.createMany(staticTranslation)

    const transcriptMock = [
      {
        timestamp: '00:00:01.123',
        text: 'First',
      },
      {
        timestamp: '00:00:02.123',
        text: 'Second',
      },
      {
        timestamp: '00:00:05.123',
        text: 'Third',
      },
      {
        timestamp: '00:00:20.123',
        text: 'Fourth',
      },
    ]
    const staticTranscript = []
    for (const [i, el] of staticTranslation.entries()) {
      for (const element of transcriptMock) {
        staticTranscript.push({
          userId: el.userId,
          staticTranslationId: i + 1,
          ...element,
        })
      }
    }

    await StaticTranscript.createMany(staticTranscript)

    const conversationTranslation = [
      {
        userId: 1,
        title: 'First Conversation Translation for userid 1',
      },
      {
        userId: 1,
        title: 'Second Conversation Translation for userid 1',
      },
      {
        userId: 2,
        title: 'First Conversation Translation for userid 2',
      },
    ]
    await ConversationTranslation.createMany(conversationTranslation)

    const conversationNodeMock = [
      {
        videoUrl: 'https://www.youtube.com/watch?v=123456',
        type: TranslationConversationNodeType.VIDEO,
      },
      {
        type: TranslationConversationNodeType.SPEECH,
      },
      {
        videoUrl: 'https://www.youtube.com/watch?v=123456',
        type: TranslationConversationNodeType.VIDEO,
      },
      {
        type: TranslationConversationNodeType.SPEECH,
      },
    ]

    const conversationNode = []
    for (const [i, el] of conversationTranslation.entries()) {
      for (const element of conversationNodeMock) {
        conversationNode.push({
          userId: el.userId,
          conversationTranslationId: i + 1,
          ...element,
        })
      }
    }
    await ConversationNode.createMany(conversationNode)

    const conversationTranscript = []
    for (const [i, item] of conversationNode.entries()) {
      if (item.type === TranslationConversationNodeType.VIDEO) {
        for (const element of transcriptMock) {
          conversationTranscript.push({
            userId: item.userId,
            conversationNodeId: i + 1,
            ...element,
          })
        }
      } else {
        conversationTranscript.push({
          userId: item.userId,
          conversationNodeId: i + 1,
          timestamp: '00:00:00.123',
          text: 'Speech to text result',
        })
      }
    }

    await ConversationTranscript.createMany(conversationTranscript)
  }
}
