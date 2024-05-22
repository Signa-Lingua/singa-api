import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const fileUploadValidator = vine.compile(
  vine.object({
    file: vine.file({ size: '2mb', extnames: ['jpg', 'jpeg', 'png'] }),
  })
)

export const fileDeleteValidator = vine.compile(
  vine.object({
    fileName: vine.string(),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'file.required': 'File is required',
  'file.size': 'File size must be less than 2MB',
  'file.extname': 'File must be one of: jpg, jpeg, png',
  'fileName.required': 'File name is required',
})
