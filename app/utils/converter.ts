import { MultipartFile } from '@adonisjs/core/bodyparser'
import { promisify } from 'node:util'
import fs from 'node:fs'

const readFile = promisify(fs.readFile)

async function convertMultipartFileToFile(multipartFile: MultipartFile): Promise<File> {
  const filePath = multipartFile.tmpPath!
  const fileContent = await readFile(filePath)
  const fileName = multipartFile.clientName
  const fileType = multipartFile.type

  // Replace this with the actual File object initialization based on your specific library
  const file = new File([fileContent], fileName, { type: fileType })

  return file
}

export { convertMultipartFileToFile }
