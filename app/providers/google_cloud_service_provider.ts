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
    this.app.container.singleton('GoogleCloudStorage', async () => {
      return new gcp.Storage({
        projectId: env.get('GOOGLE_CLOUD_STORAGE_PROJECT_ID'),
        keyFilename:
          env.get('GOOGLE_CLOUD_STORAGE_CREDENTIALS_FILE') ||
          JSON.parse(env.get('GOOGLE_CLOUD_STORAGE_CREDENTIALS') as string),
      })
    })
  }
}
