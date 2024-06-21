import { SocialProvider } from '#lib/constants/auth'
import StaticTranscript from '#models/static_transcript'
import StaticTranslation from '#models/static_translation'
import User from '#models/user'
import Article from '#models/article'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ConversationTranslation from '#models/conversation_translation'
import ConversationNode from '#models/conversation_node'
import { TranslationConversationNodeType } from '#lib/constants/translation'
import ConversationTranscript from '#models/conversation_transcript'
import Role from '#models/role'
import { Status } from '#lib/constants/status'
import env from '#start/env'

export default class extends BaseSeeder {
  async run() {
    // Insert articles

    const adminRole = await Role.findByOrFail('name', 'admin')
    const defaultRole = await Role.findByOrFail('name', 'user')

    // Insert user
    await User.createMany([
      {
        name: 'Admin',
        email: 'admin@admin.com',
        password: env.get('ADMIN_PASSWORD'),
        provider: SocialProvider.PASSWORD,
        isSignUser: true,
        roleId: adminRole.id,
      },
      // registered user
      {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'test12345',
        provider: SocialProvider.PASSWORD,
        isSignUser: true,
        roleId: defaultRole.id,
      },
      // registered social user
      {
        name: 'Susan Doe',
        email: 'susandoe@gmail.com',
        password: null,
        provider: SocialProvider.GOOGLE,
        isSignUser: false,
        roleId: defaultRole.id,
      },
      // guest user
      {
        name: 'Mary Doe',
        email: null,
        password: null,
        provider: null,
        isSignUser: true,
        roleId: defaultRole.id,
      },
      // second guest user
      {
        name: 'Jane Doe',
        email: null,
        password: null,
        provider: null,
        isSignUser: false,
        roleId: defaultRole.id,
      },
    ])

    const staticTranslation = [
      {
        userId: 1,
        title: 'First Static Translation for userid 1',
        video: null,
        videoUrl: 'https://www.youtube.com/watch?v=123456',
      },
      {
        userId: 1,
        title: 'Second Static Translation for userid 1',
        video: null,
        videoUrl: 'https://www.youtube.com/watch?v=123456',
      },
      {
        userId: 2,
        title: 'First Static Translation for userid 2',
        video: null,
        videoUrl: 'https://www.youtube.com/watch?v=123456',
      },
    ]

    await StaticTranslation.createMany(staticTranslation)

    const transcriptMock = [
      {
        timestamp: '00:00:01:123',
        text: 'First',
      },
      {
        timestamp: '00:00:02:123',
        text: 'Second',
      },
      {
        timestamp: '00:00:05:123',
        text: 'Third',
      },
      {
        timestamp: '00:00:20:123',
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
        status: Status.SUCCESS,
      },
      {
        videoUrl: 'https://www.youtube.com/watch?v=123456',
        type: TranslationConversationNodeType.VIDEO,
      },
      {
        type: TranslationConversationNodeType.SPEECH,
        status: Status.SUCCESS,
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
          timestamp: '00:00:00:123',
          text: 'Speech to text result',
        })
      }
    }

    await ConversationTranscript.createMany(conversationTranscript)

    await Article.createMany([
      {
        title: 'ASL in the Workplace: Bridging the Communication Gap',
        description:
          '<p class="text-inherit">American Sign Language (ASL) is no longer confined to the deaf and hard-of-hearing communities. In today\'s diverse workplaces, fluency in ASL offers a valuable asset, fostering inclusivity and effective communication for both deaf and hearing employees. This article explores the growing importance of ASL in professional settings, highlighting the benefits it brings to employers and employees alike.</p><p class="text-inherit"></p>',
        imageUrl:
          'https://storage.googleapis.com/singa-bucket/uploads/article/article-Ov4VgcK9BTwk95r3.jpg',
        createdBy: 1,
      },
      {
        title: 'ASL and Deaf Culture: Breaking Down Barriers',
        description:
          '<p class="text-inherit">American Sign Language (ASL) is more than just a collection of hand gestures; it\'s the cornerstone of a vibrant deaf culture rich in history, traditions, and artistic expression. While ASL allows communication between deaf and signing individuals, understanding deaf culture fosters a deeper appreciation for the unique experiences and perspectives of the deaf community.</p><p class="text-inherit">This article explores the beautiful tapestry of deaf culture, examining its historical development, the core values it embodies, and the ways ASL plays a central role in its expression.</p>',
        imageUrl:
          'https://storage.googleapis.com/singa-bucket/uploads/article/article-SRMOmKr8GBeQfDoE.jpg',
        createdBy: 1,
      },
      {
        title: 'The Power of Two Hands: How ASL Fosters Cognitive Benefits',
        description:
          '<p class="text-inherit">American Sign Language (ASL) isn\'t just a beautiful and expressive language for deaf and hard-of-hearing communities. Studies have revealed a fascinating connection between learning ASL and a multitude of cognitive benefits. This article delves into the world of ASL, exploring how engaging with this unique language can enhance memory, boost problem-solving skills, and even improve spatial reasoning.</p>',
        imageUrl:
          'https://storage.googleapis.com/singa-bucket/uploads/article/article-Ov4VgcK9BTwk95r3.jpg',
        createdBy: 1,
      },
    ])
  }
}
