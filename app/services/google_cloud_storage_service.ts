import env from '#start/env'
import { TGCPStorage, TGoogleFileServiceResult } from '#types/GoogleCloudStorageService'
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
      return {
        error: true,
        message: error.message,
      }
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

      const publicUrl = result[0].publicUrl()

      return {
        error: false,
        message: 'File uploaded',
        data: publicUrl.replace(/%2F/g, '/'),
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

  async getFileMedatata(subPath: string, fileName: string) {
    try {
      const gcs = this.#gcloudStorage.bucket(this.#bucketName)
      const file = gcs.file(this.generatePath(subPath, fileName))
      const [metadata] = await file.getMetadata()

      return {
        error: false,
        message: 'File metadata',
        data: metadata,
      }
    } catch (error) {
      return {
        error: true,
        message: error.message,
      }
    }
  }

  async getTotalSize(subPath: string, arrayOfFileName: string[]) {
    let totalSize = 0

    try {
      for (const fileName of arrayOfFileName) {
        const metadata = await this.getFileMedatata(subPath, fileName)
        const fileSize = metadata.data!.size // in bytes

        // TODO: Fix this
        totalSize += Number.parseInt(fileSize as string)
      }
    } catch (error) {
      return {
        error: true,
        message: error.message,
      }
    }

    return {
      error: false,
      message: 'Total size',
      data: totalSize,
    }
  }

  generatePath(subPath: string, fileName: string) {
    return `${this.#storagePath}/${subPath}/${fileName}`
  }
}

const googleCloudStorageService = new GoogleCloudStorageService()

export default googleCloudStorageService
