import { customAlphabet, urlAlphabet } from 'nanoid'

const nanoid = customAlphabet(urlAlphabet, 16)

function generateAvatarName(name: string, extname: string) {
  return `${nanoid()}_${name}.${extname}`
}

function generateFileName(userId: number, extname: string) {
  return `${nanoid()}_${userId}.${extname}`
}

export { generateAvatarName, generateFileName }
