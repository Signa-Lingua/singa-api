// import type { HttpContext } from '@adonisjs/core/http'

import fileService from '#services/file_service'
import { fileDeleteValidator, fileUploadValidator } from '#validators/fileupload'
import { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '#utils/response_formatter'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import vine from '@vinejs/vine'
import { nanoid } from 'nanoid'
import ffmpegService from '#services/ffmpeg_service'

export default class TestsController {
  async test({ request, response }: HttpContext) {
    const { file } = await request.validateUsing(
      vine.compile(
        vine.object({
          file: vine.file({
            size: 10 * 1000 * 1000 * 1000,
            extnames: ['mp4'],
          }),
        })
      )
    )

    const ffmpegResult = await ffmpegService.resizeVideo(file.tmpPath!)

    if (ffmpegResult.error) {
      return response.internalServerError(responseFormatter(500, 'error', ffmpegResult.message))
    }

    // fs.existsSync(ffmpegResult.resizedVideoPath)
    //   ? console.log(ffmpegResult.resizedVideoPath)
    //   : console.log('file does not exist')

    const uploadedFile = await googleCloudStorageService.save(
      'test',
      ffmpegResult.resizedVideoPath,
      `video-${nanoid(16)}.mp4`
    )

    if (uploadedFile.error) {
      return response.internalServerError(responseFormatter(500, 'error', uploadedFile.message))
    }

    ffmpegResult.cleanupFile()

    // fs.existsSync(ffmpegResult.resizedVideoPath)
    //   ? console.log(ffmpegResult.resizedVideoPath)
    //   : console.log('file does not exist')

    return response.ok(responseFormatter(200, 'success', 'File uploaded'))
  }

  async testFileUpload({ request, response }: HttpContext) {
    const { file } = await request.validateUsing(fileUploadValidator)

    const fileName = await fileService.save(file, 'test')

    return response.ok(
      responseFormatter(200, 'success', 'File uploaded', {
        fileName,
        originalName: file.clientName,
      })
    )
  }

  async testFileDelete({ request, response }: HttpContext) {
    const { fileName } = await request.validateUsing(fileDeleteValidator)

    await fileService.delete(fileName, 'test')

    return response.ok(responseFormatter(200, 'success', 'File deleted'))
  }

  async testGoogleCloudStorage({ request, response }: HttpContext) {
    const { file } = await request.validateUsing(fileUploadValidator)

    const result = await googleCloudStorageService.save('test', file.tmpPath!, file.clientName)

    if (result.error) {
      return response.internalServerError(responseFormatter(500, 'error', result.message, null))
    }

    return response.ok(responseFormatter(200, 'success', 'File uploaded', result.data))
  }

  async testGoogleCloudStorageDelete({ request, response }: HttpContext) {
    const { fileName } = await request.validateUsing(fileDeleteValidator)

    const result = await googleCloudStorageService.delete('test', fileName)

    if (result.error) {
      return response.internalServerError(responseFormatter(500, 'error', result.message, null))
    }

    return response.ok(responseFormatter(200, 'success', 'File deleted'))
  }
}
