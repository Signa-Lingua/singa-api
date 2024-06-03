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
      return new gcp.Storage()
    })
  }
}
