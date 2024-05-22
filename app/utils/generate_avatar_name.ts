export default function generateAvatarName(name: string, extname: string) {
  return `${new Date().getTime()}_${name}.${extname}`
}
