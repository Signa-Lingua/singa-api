/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import ffmpeg from 'fluent-ffmpeg'
import tmp from 'tmp-promise'
import fs from 'node:fs'
import Ffmpeg from 'fluent-ffmpeg'

// NOTE: MAKE SURE TO CALL CLEANUP() AFTER USE TO FREE UP STORAGE/MEMORY
export class FfmpegApi {
  private initialized: boolean = false
  private isPath: string | null = null
  private tmpVideo: Awaited<tmp.FileResult> | null = null
  private tmpResized: Awaited<tmp.FileResult> | null = null

  get originalVideoPath() {
    return this.tmpVideo?.path
  }

  get resizedVideoPath() {
    return this.tmpResized?.path
  }

  async init() {
    console.log('Initializing temporary files')

    tmp.setGracefulCleanup()

    try {
      const tmpVideo = await tmp.file()
      const tmpResized = await tmp.file()

      this.tmpVideo = tmpVideo
      this.tmpResized = tmpResized

      console.log(this.tmpVideo.path)
      console.log(this.tmpResized.path)

      this.initialized = true

      return this
    } catch (err) {
      console.error(err)

      throw err
    }
  }

  async resizeVideo(videoBufferOrPath: Buffer | string) {
    console.log('Resizing video')

    // If true, videoBufferOrPath is a path
    // save the path to this.isPath to allow cleanup in this.cleanup()
    // If false, videoBufferOrPath is a buffer
    // save the buffer to a temporary file
    this.isPath = typeof videoBufferOrPath === 'string' ? videoBufferOrPath : null

    if (!this.initialized) {
      await this.init()
    }

    try {
      // If false, videoBufferOrPath is a buffer
      // save the buffer to a temporary file
      if (!this.isPath) {
        await fs.promises.writeFile(this.tmpVideo!.path, videoBufferOrPath)
      }

      console.time('resize')
      // Needs to be wrapped in a promise to allow await
      await new Promise<void>((resolve, reject) => {
        // Load video into ffmpeg
        // Determined by the type of videoBufferOrPath
        ffmpeg(this.isPath ? (videoBufferOrPath as string) : this.tmpVideo!.path)
          .size('640x480')
          // .size('1280x720')
          .format('mp4')
          .on('end', () => {
            console.log('Resizing complete')
            console.timeEnd('resize')
            resolve()
          })
          .on('error', (err) => {
            console.error(err)
            this.cleanup()
            reject(err)
          })
          .save(this.tmpResized!.path)
      })
      Ffmpeg.ffprobe(videoBufferOrPath as string, (err, metadata) => {
        if (err) {
          console.error(err)
        }

        console.log('original: ', metadata.streams[0].width, metadata.streams[0].height)
        // console.log(metadata.format.size)
      })
      Ffmpeg.ffprobe(this.tmpResized!.path as string, (err, metadata) => {
        if (err) {
          console.error(err)
        }

        console.log('resized: ', metadata.streams[0].width, metadata.streams[0].height)
        // console.log(metadata.format.size)
      })
    } catch (err) {
      console.error(err)
      await this.cleanup()
    }
  }

  // Cleanup temporary files
  cleanup() {
    // Delay cleanup to allow process to finish
    setTimeout(async () => {
      console.log('Cleaning up temporary files')
      if (this.initialized) {
        if (this.isPath) {
          fs.unlink(this.isPath, (err) => {
            if (err) {
              console.error(err)
            }
          })
        }
        await this.tmpVideo!.cleanup()
        await this.tmpResized!.cleanup()
      }
    }, 100)
  }
}
