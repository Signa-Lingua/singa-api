// import type { HttpContext } from '@adonisjs/core/http'

import StaticTranscript from "#models/static_transcript";
import StaticTranslation from "#models/static_translation";
import User from "#models/user";
import { HttpContext } from "@adonisjs/core/http";

export default class TestsController {
  async test({ response }: HttpContext) {
    const user = await User.query().where('id', 1).preload('staticTranslations', (query) => {
      query.preload('staticTranscripts');
    });

    const translation = await StaticTranslation.findBy('user_id', 1);
    const transcript = await StaticTranscript.query().where('static_translation_id', translation!.id);

    // console.log(translation?.serialize())
    // console.log(transcript.map((t) => t.serialize()))

    const q = await User
      .query()
      .join("static_translation", "users.id", "static_translation.user_id")
      .join("static_transcript", "static_translation.id", "static_transcript.static_translation_id")
      .select("users.*", "static_translation.id.*", "static_transcript.*")
      .where('id', 1)
      .first();

    console.log(q);


    if (user) {
      console.log('User found');
      // console.log(user.serialize())
      // console.log(user.staticTranslations)
    } else {
      console.log('User not found');
    }

    return response.json({ message: 'Hello, test!' });
  }
}