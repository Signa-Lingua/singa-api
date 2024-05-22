function generateAvatarName(name: string, extname: string) {
  return `${new Date().getTime()}_${name}.${extname}`
}

function generateFileName(userId: number, extname: string) {
  return `${new Date().getTime()}_${userId}.${extname}`
}

export { generateAvatarName, generateFileName }
