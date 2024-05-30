import env from '#start/env'
import { ApplicationService } from '@adonisjs/core/types'
import * as gcp from '@google-cloud/storage'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    GoogleCloudStorage: gcp.Storage
  }
}

export default class GoogleCloudStorageProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    let credentials: string

    try {
      credentials = JSON.parse(env.get('GOOGLE_CLOUD_STORAGE_CREDENTIALS_FILE') as string)
    } catch (error) {
      credentials = env.get('GOOGLE_CLOUD_STORAGE_CREDENTIALS_FILE')
    }

    this.app.container.singleton('GoogleCloudStorage', async () => {
      return new gcp.Storage({
        projectId: env.get('GOOGLE_CLOUD_STORAGE_PROJECT_ID'),
        keyFilename: credentials,
      })
    })
  }
}
