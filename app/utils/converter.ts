import { MultipartFile } from '@adonisjs/core/bodyparser'
import { promisify } from 'node:util'
import fs from 'node:fs'

export type UFileConverterSuccess<T> = {
  error: false
  message: string
  data: T
}

export type UFileConverterFailed = {
  error: true
  message: string
}

export type UFileConverterResult<T> = UFileConverterSuccess<T> | UFileConverterFailed

const readFile = promisify(fs.readFile)

async function convertMultipartFileToFile(
  multipartFile: MultipartFile
): Promise<UFileConverterResult<File>> {
  try {
    const filePath = multipartFile.tmpPath!
    const fileContent = await readFile(filePath)
    const fileName = multipartFile.clientName
    const fileType = multipartFile.type

    // Replace this with the actual File object initialization based on your specific library
    const file = new File([fileContent], fileName, { type: fileType })

    return {
      error: false,
      message: 'File converted successfully',
      data: file,
    }
  } catch (error) {
    return {
      error: true,
      message: 'File conversion failed',
    }
  }
}

export { convertMultipartFileToFile }
