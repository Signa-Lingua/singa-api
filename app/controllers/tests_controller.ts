// import type { HttpContext } from '@adonisjs/core/http'

import fileService from '#services/file_service'
import { fileDeleteValidator, fileUploadValidator } from '#validators/fileupload'
import { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '#utils/response_formatter'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import vine from '@vinejs/vine'
import { nanoid } from 'nanoid'
import ffmpegService from '#services/ffmpeg_service'
import { HTTP } from '#lib/constants/http'
import TestqueueJob from '../jobs/testqueue_job.js'
import TestQueue from '#models/test_queue'

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
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', ffmpegResult.message)
      )
    }

    const uploadedFile = await googleCloudStorageService.save(
      'test',
      ffmpegResult.resizedVideoPath,
      `video-${nanoid(16)}.mp4`
    )

    if (uploadedFile.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', uploadedFile.message)
      )
    }

    ffmpegResult.cleanupFile()

    return response.ok(responseFormatter(HTTP.OK, 'success', 'File uploaded'))
  }

  async testFileUpload({ request, response }: HttpContext) {
    const { file } = await request.validateUsing(fileUploadValidator)

    const fileName = await fileService.save(file, 'test')

    return response.ok(
      responseFormatter(HTTP.OK, 'success', 'File uploaded', {
        fileName,
        originalName: file.clientName,
      })
    )
  }

  async testFileDelete({ request, response }: HttpContext) {
    const { fileName } = await request.validateUsing(fileDeleteValidator)

    await fileService.delete(fileName, 'test')

    return response.ok(responseFormatter(HTTP.OK, 'success', 'File deleted'))
  }

  async testGoogleCloudStorage({ request, response }: HttpContext) {
    const { file } = await request.validateUsing(fileUploadValidator)

    const result = await googleCloudStorageService.save('test', file.tmpPath!, file.clientName)

    if (result.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', result.message, null)
      )
    }

    return response.ok(responseFormatter(HTTP.OK, 'success', 'File uploaded', result.data))
  }

  async testGoogleCloudStorageDelete({ request, response }: HttpContext) {
    const { fileName } = await request.validateUsing(fileDeleteValidator)

    const result = await googleCloudStorageService.delete('test', fileName)

    if (result.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', result.message, null)
      )
    }

    return response.ok(responseFormatter(HTTP.OK, 'success', 'File deleted'))
  }

  async testGoogleCloudStorageMetadata({ request, response }: HttpContext) {
    const { fileName } = await request.validateUsing(fileDeleteValidator)

    const result = await googleCloudStorageService.getFileMedatata('test', fileName)

    if (result.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', result.message, null)
      )
    }

    return response.ok(responseFormatter(HTTP.OK, 'success', 'File metadata', result.data))
  }

  async testQueueSystem({ response }: HttpContext) {
    const request = new TestqueueJob()

    const testQueue = await TestQueue.create({
      name: 'test',
      status: 'pending',
    })

    request.handle({ requestId: testQueue.id })

    return response.ok(responseFormatter(HTTP.OK, 'success', 'Queue system working'))
  }
}
