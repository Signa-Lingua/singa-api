import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(254).optional(),
    password: vine.string().minLength(8).maxLength(64).confirmed().optional(),
    avatar: vine.file({ size: '2mb', extnames: ['png', 'jpg', 'jpeg'] }).optional(),
    isSignUser: vine.boolean().optional(),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'name.minLength': 'Name must be at least 3 characters',
  'name.maxLength': 'Name must be at most 254 characters',
  'password.minLength': 'Password must be at least 8 characters',
  'password.maxLength': 'Password must be at most 64 characters',
  'password.confirmed': 'Password does not match',
  'password.confirmed.required': 'Password confirmation is required',
  'avatar.file': 'Invalid avatar (must be type of file)',
  'isSignUser.boolean': 'Invalid isSignUser (must be a boolean)',
  'avatar.size': 'Invalid avatar (must be less than 2mb)',
  'avatar.extname': 'Invalid avatar (must be one of: {{extnames}})',
  'avatar.required': 'Avatar is required',
})
