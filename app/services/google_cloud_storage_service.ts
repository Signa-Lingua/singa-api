import ConversationNode from '#models/conversation_node'
import StaticTranslation from '#models/static_translation'
import env from '#start/env'
import { TGCPStorage, TGoogleFileServiceResult } from '#types/GoogleCloudStorageService'
import app from '@adonisjs/core/services/app'
import { FileMetadata } from '@google-cloud/storage'

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

  async getFileMedatata(
    subPath: string,
    fileName: string
  ): Promise<TGoogleFileServiceResult<FileMetadata>> {
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

  async getTotalSize(
    subPath: string,
    arrayOfFileName: string[]
  ): Promise<TGoogleFileServiceResult<number>> {
    let totalSize = 0

    try {
      for (const fileName of arrayOfFileName) {
        const metadata = await this.getFileMedatata(subPath, fileName)

        if (metadata.error) {
          return metadata
        }

        // in bytes
        const fileSize = metadata.data.size

        if (typeof fileSize === 'string') {
          totalSize += Number.parseInt(fileSize)
        } else if (typeof fileSize === 'number') {
          totalSize += fileSize
        } else {
          return {
            error: true,
            message: 'File size is not a number',
          }
        }
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

  async getUserUsedQuota(userId: number): Promise<TGoogleFileServiceResult<number>> {
    const ownedStaticTranslation = await StaticTranslation.query()
      .where('user_id', userId)
      .whereNotNull('video')
      .select('video')

    const ownedConversationNode = await ConversationNode.query()
      .where('user_id', userId)
      .whereNotNull('video')
      .select('video')

    const ownedStaticTotalSize = await this.getTotalSize(
      env.get('STATIC_STORAGE_PATH'),
      ownedStaticTranslation.map((translation) => translation.video) as string[]
    )

    if (ownedStaticTotalSize.error) {
      return ownedStaticTotalSize
    }

    const ownedConversationTotalSize = await this.getTotalSize(
      env.get('CONVERSATION_STORAGE_PATH'),
      ownedConversationNode.map((node) => node.video) as string[]
    )

    if (ownedConversationTotalSize.error) {
      return ownedConversationTotalSize
    }

    return {
      error: false,
      message: 'User used quota',
      data: ownedStaticTotalSize.data + ownedConversationTotalSize.data,
    }
  }

  generatePath(subPath: string, fileName: string) {
    return `${this.#storagePath}/${subPath}/${fileName}`
  }
}

const googleCloudStorageService = new GoogleCloudStorageService()

export default googleCloudStorageService
