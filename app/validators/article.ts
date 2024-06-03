import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const articleValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(254),
    description: vine.string().minLength(3).maxLength(254),
    imageUrl: vine.string().minLength(3).maxLength(254),
  })
)

export const articleUpdateValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(254).optional(),
    description: vine.string().minLength(3).maxLength(254).optional(),
    imageUrl: vine.string().minLength(3).maxLength(254).optional(),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'title.required': 'Title is required',
  'title.minLength': 'Title must be at least 3 characters',
  'title.maxLength': 'Title must be at most 254 characters',
  'description.required': 'Description is required',
  'description.minLength': 'Description must be at least 3 characters',
  'description.maxLength': 'Description must be at most 254 characters',
  'imageUrl.required': 'Image URL is required',
  'imageUrl.minLength': 'Image URL must be at least 3 characters',
  'imageUrl.maxLength': 'Image URL must be at most 254 characters',
})
