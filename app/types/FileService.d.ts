export type TFileServiceSuccess = {
  error: false
  message: string
}

export type TFileServiceError = {
  error: true
  message: string
}

export type TFileServiceResult = TFileServiceSuccess | TFileServiceError
