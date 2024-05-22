import ffmpeg from 'fluent-ffmpeg'
import tmp from 'tmp-promise'
import fs from 'node:fs'
import { TFfmpegServiceResult } from '../types/FfmpegService.js'

export async function resizeVideo(
  filePath: string,
  dimension: string = '640x480'
): Promise<TFfmpegServiceResult> {
  try {
    const tmpResizedFile = await tmp.file()

    // Wrap cleanup method to be passed to the result object
    // So that related file can be cleaned up after the process is done
    const cleanupWrapper = () => {
      cleanup(filePath, tmpResizedFile.cleanup)
    }

    await new Promise<TFfmpegServiceResult>((resolve, reject) => {
      // Load video into ffmpeg
      // Resize video according to dimension
      // Save resized video to tmpResizedFile.path
      ffmpeg(filePath)
        .size(dimension)
        .format('mp4')
        .on('end', () => {
          resolve({
            error: false,
            message: 'Resizing complete',
            resizedVideoPath: tmpResizedFile.path,
            cleanupFile: cleanupWrapper,
          })
        })
        .on('error', (err) => {
          console.log(err.message)

          cleanupWrapper()

          reject({
            error: true,
            message: err.message,
          })
        })
        .save(tmpResizedFile.path)
    })

    return {
      error: false,
      message: 'Resizing complete',
      resizedVideoPath: tmpResizedFile.path,
      cleanupFile: cleanupWrapper,
    }
  } catch (error) {
    console.error(error)
    return {
      error: true,
      message: error.message,
    }
  }
}

export function cleanup(path: string, tmpCleanupMethod?: () => Promise<void>) {
  setTimeout(async () => {
    if (fs.existsSync(path)) {
      fs.unlink(path, (err) => {
        if (err) {
          return {
            error: true,
            message: err.message,
          }
        }
      })
    }

    if (tmpCleanupMethod) {
      await tmpCleanupMethod()
    }
  }, 100)
}

export default {
  resizeVideo,
  cleanup,
}
