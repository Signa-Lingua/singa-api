import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const staticTranslationValidator = vine.compile(
  vine.object({
    title: vine.string(),
    file: vine.file({ size: '100mb', extnames: ['mp4'] }),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'title.required': 'Title is required',
  'file.required': 'File is required',
  'file.size': 'File size must be less than 100MB',
  'file.extname': 'File must be one of: {{extnames}}',
})
