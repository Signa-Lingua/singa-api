import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const staticTranslationValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255),
    file: vine.file({ size: '100mb', extnames: ['mp4'] }),
  })
)

// Update should only allow title to be updated
// User should delete and create a new record if they want to update the file
export const staticTranslationUpdateValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'title.required': 'Title is required',
  'title.maxLength': 'Title must be less than 255 characters',
  'file.required': 'File is required',
  'file.size': 'File size must be less than 100MB',
  'file.extname': 'File must be one of: {{extnames}}',
})
