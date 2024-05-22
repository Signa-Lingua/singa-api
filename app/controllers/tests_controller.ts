// import type { HttpContext } from '@adonisjs/core/http'

import fileService from '#services/file_service'
import { fileDeleteValidator, fileUploadValidator } from '#validators/fileupload'
import { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '../utils/response_formatter.js'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import { FfmpegApi } from '../lib/ffmpeg_api.js'
import vine from '@vinejs/vine'
import fs from 'node:fs'
import { nanoid } from 'nanoid'

export default class TestsController {
  async test({ request, response }: HttpContext) {
    const payload = await request.validateUsing(
      vine.compile(
        vine.object({
          file: vine.file({
            size: 10 * 1000 * 1000 * 1000,
            extnames: ['mp4'],
          }),
        })
      )
    )

    const proc = await new FfmpegApi().init()
    console.log(payload.file.tmpPath!)
    await proc.resizeVideo(payload.file.tmpPath!)

    fs.existsSync(payload.file.tmpPath! as string)
      ? console.log('file exists')
      : console.log('file does not exist')
    fs.existsSync(proc.resizedVideoPath as string)
      ? console.log('file exists')
      : console.log('file does not exist')
    fs.existsSync(proc.originalVideoPath as string)
      ? console.log('file exists')
      : console.log('file does not exist')

    await googleCloudStorageService.save('test', proc.resizedVideoPath!, `video-${nanoid(16)}.mp4`)

    proc.cleanup()

    setTimeout(() => {
      fs.existsSync(payload.file.tmpPath! as string)
        ? console.log('file exists')
        : console.log('file does not exist')
      fs.existsSync(proc.resizedVideoPath as string)
        ? console.log('file exists')
        : console.log('file does not exist')
      fs.existsSync(proc.originalVideoPath as string)
        ? console.log('file exists')
        : console.log('file does not exist')
    }, 2000)

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
