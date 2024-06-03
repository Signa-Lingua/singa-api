import { TranslationConversationNodeType } from '#lib/constants/translation'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const conversationTranslationValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255),
  })
)

export const conversationNodeVideoValidator = vine.compile(
  vine.object({
    file: vine.file({ size: '100mb', extnames: ['mp4'] }),
    type: vine.literal(TranslationConversationNodeType.VIDEO),
  })
)

export const conversationNodeSpeechValidator = vine.compile(
  vine.object({
    text: vine.string(),
    type: vine.literal(TranslationConversationNodeType.SPEECH),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'title.required': 'Title is required',
  'title.maxLength': 'Title must be less than 255 characters',
  'type.literal': 'Type must be one of: {{allowedValues}}',
  'file.required': 'File is required',
  'file.size': 'File size must be less than 100MB',
  'file.extname': 'File must be one of: {{extnames}}',
})
