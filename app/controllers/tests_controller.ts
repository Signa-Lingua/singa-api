// import type { HttpContext } from '@adonisjs/core/http'

import StaticTranscript from '#models/static_transcript'
import StaticTranslation from '#models/static_translation'
import User from '#models/user'
import fileService from '#services/file_service'
import { fileDeleteValidator, fileUploadValidator } from '#validators/fileupload'
import { HttpContext } from '@adonisjs/core/http'
import responseFormatter from '../utils/response_formatter.js'

export default class TestsController {
  async test({ response }: HttpContext) {
    const user = await User.query()
      .where('id', 1)
      .preload('staticTranslations', (query) => {
        query.preload('staticTranscripts')
      })

    const translation = await StaticTranslation.findBy('user_id', 1)
    const transcript = await StaticTranscript.query().where(
      'static_translation_id',
      translation!.id
    )

    // console.log(translation?.serialize())
    // console.log(transcript.map((t) => t.serialize()))

    if (user) {
      console.log('User found')
      // console.log(user.serialize())
      // console.log(user.staticTranslations)
    } else {
      console.log('User not found')
    }

    return response.json({ message: 'Hello, test!' })
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
}
