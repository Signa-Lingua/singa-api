import TestQueue from '#models/test_queue'
import { Job } from '@rlanz/bull-queue'

interface TestqueueJobPayload {
  requestId: number
}

export default class TestqueueJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: TestqueueJobPayload) {
    const { requestId } = payload

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000))

      await TestQueue.query().where('id', requestId).update({ status: 'success' })
    } catch (error) {
      await TestQueue.query().where('id', requestId).update({ status: 'failed' })
    }
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: TestqueueJobPayload) {}
}
