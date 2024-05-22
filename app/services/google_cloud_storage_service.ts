import env from '#start/env'
import { TGCPStorage, TGoogleFileServiceResult } from '../types/GoogleCloudStorageService.js'
import app from '@adonisjs/core/services/app'

class GoogleCloudStorageService {
  #gcloudStorage: TGCPStorage = {} as TGCPStorage
  #bucketName = env.get('GOOGLE_CLOUD_STORAGE_BUCKET_NAME')
  #storagePath = env.get('GOOGLE_CLOUD_STORAGE_STORAGE_PATH')

  constructor() {
    this.init()
  }

  async init() {
    try {
      this.#gcloudStorage = await app.container.make('GoogleCloudStorage')
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  async save(
    subPath: string,
    filePath: string,
    fileName: string,
    generationMatchPrecondition: number = 0
  ): Promise<TGoogleFileServiceResult<string>> {
    try {
      const gcs = this.#gcloudStorage.bucket(this.#bucketName)
      const result = await gcs.upload(filePath, {
        destination: this.generatePath(subPath, fileName),
        predefinedAcl: 'publicRead',
        public: true,
        preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
      })

      return {
        error: false,
        message: 'File uploaded',
        data: result[0].metadata.mediaLink!,
      }
    } catch (error) {
      return {
        error: true,
        message: error.message,
      }
    }
  }

  async delete(subPath: string, fileName: string): Promise<TGoogleFileServiceResult<null>> {
    try {
      const gcs = this.#gcloudStorage.bucket(this.#bucketName)
      await gcs.file(this.generatePath(subPath, fileName)).delete()

      return {
        error: false,
        message: 'File deleted',
        data: null,
      }
    } catch (error) {
      return {
        error: true,
        message: error.message,
      }
    }
  }

  generatePath(subPath: string, fileName: string) {
    return `${this.#storagePath}/${subPath}/${fileName}`
  }
}

const googleCloudStorageService = new GoogleCloudStorageService()

export default googleCloudStorageService
