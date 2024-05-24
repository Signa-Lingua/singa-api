import env from '#start/env'
import fs from 'node:fs'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { TFileServiceResult } from '#types/FileService'

class FileService {
  #fs: typeof fs = fs
  #folder: string = env.get('DRIVE_ROOT') !== null ? env.get('DRIVE_ROOT') : './storage/uploads'

  async save(file: MultipartFile, folder: string): Promise<string> {
    const fileName = `${new Date().getTime()}.${file.extname}`

    await file.move(`${this.#folder}/${folder}`, {
      name: fileName,
    })

    return fileName
  }

  async isFileExists(fileName: string, folder: string): Promise<TFileServiceResult> {
    try {
      this.#fs.existsSync(`${this.#folder}/${folder}/${fileName}`)
      return {
        error: false,
        message: 'File found',
      }
    } catch (error) {
      return {
        error: true,
        message: 'File not found',
      }
    }
  }

  async delete(fileName: string, folder: string): Promise<TFileServiceResult> {
    try {
      this.#fs.unlinkSync(`${this.#folder}/${folder}/${fileName}`)
      return {
        error: false,
        message: 'File deleted',
      }
    } catch (error: unknown) {
      return {
        error: true,
        message: 'File not found',
      }
    }
  }
}

const fileService = new FileService()

export default fileService
