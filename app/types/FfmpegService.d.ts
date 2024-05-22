export type TFfmpegServiceSuccess = {
  error: false
  message: string
  resizedVideoPath: string
  cleanupFile: () => void
}

export type TFfmpegServiceError = {
  error: true
  message: string
}

export type TFfmpegServiceResult = TFfmpegServiceSuccess | TFfmpegServiceError
