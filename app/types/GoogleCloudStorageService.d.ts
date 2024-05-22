import * as gcp from '@google-cloud/storage'

export type TServiceAccount = {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}

export type TGoogleFileServiceSuccess<T> = {
  error: false
  message: string
  data: T
}

export type TGoogleFileServiceError = {
  error: true
  message: string
}

export type TGoogleFileServiceResult<T> = TGoogleFileServiceSuccess<T> | TGoogleFileServiceError

export type TGCPStorage = gcp.Storage
