import logger from '@adonisjs/core/services/logger'
import axios from 'axios'

async function initPredictModel(url: string) {
  try {
    await axios.post(`${url}/init`)
  } catch (error) {
    const normalError = error as AxiosError<PredictionResponse>

    if (normalError.response?.data.error) {
      logger.error(normalError.response?.data)
      return
    }

    logger.error(error)
  }
}
