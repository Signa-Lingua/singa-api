import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const articleValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(254),
    description: vine.string().minLength(3).maxLength(254),
    image: vine.file({ size: '2mb', extnames: ['jpg', 'png'] }),
  })
)

export const articleUpdateValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(254).optional(),
    description: vine.string().minLength(3).maxLength(254).optional(),
    image: vine.file({ size: '2mb', extnames: ['jpg', 'png'] }).optional(),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'title.required': 'Title is required',
  'title.minLength': 'Title must be at least 3 characters',
  'title.maxLength': 'Title must be at most 254 characters',
  'description.required': 'Description is required',
  'description.minLength': 'Description must be at least 3 characters',
  'description.maxLength': 'Description must be at most 254 characters',
  'image.required': 'Image is required',
  'image.size': 'Image size must be less than 2MB',
  'image.extname': 'Image must be one of: {{extnames}}',
})
