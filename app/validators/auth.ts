import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().minLength(3).maxLength(254),
    password: vine.string().minLength(8).maxLength(64),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(254),
    email: vine.string().email().minLength(3).maxLength(254),
    password: vine.string().minLength(8).maxLength(64),
  })
)

export const updateAccessTokenValidator = vine.compile(
  vine.object({
    token: vine.string().exists(async (db, value) => {
      const token = await db.from('authentications').where('token', value).first()
      return !!token
    }),
  })
)

export const refreshTokenValidator = vine.compile(
  vine.object({
    refreshToken: vine.string(),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'email.email': 'Invalid email address',
  'email.required': 'Email is required',
  'email.minLength': 'Email must be at least 3 characters',
  'email.maxLength': 'Email must be at most 254 characters',
  'password.required': 'Password is required',
  'password.minLength': 'Password must be at least 8 characters',
  'password.maxLength': 'Password must be at most 64 characters',
  'name.required': 'Name is required',
  'name.minLength': 'Name must be at least 3 characters',
  'name.maxLength': 'Name must be at most 254 characters',
  'providers.required': 'Provider is required',
  'providers.enum': 'Invalid provider (must be one of: ${values})',
  'token.required': 'Token is required',
  'token.exists': 'Invalid token',
  'refreshToken.required': 'Refresh token is required',
  'refreshToken.exists': 'Invalid refresh token already exists',
})
