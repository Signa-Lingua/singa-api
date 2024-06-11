/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'
import responseFormatter from '#utils/response_formatter'
import { HTTP } from '#lib/constants/http'

// export const throttle = limiter.define('global', () => {
//   return limiter.allowRequests(30).every('5 minute')
// })

export const apiThrottle = limiter.define('singa-api', (ctx) => {
  /**
   * Allow authenticated users to make 150 requests every 5 minutes by their user id
   */
  if (ctx.auth.user) {
    return limiter.allowRequests(150).every('5 minute').usingKey(`user_${ctx.auth.user.id}`)
  }
  /**
   * Allow unauthenticated users to make 50 requests every 5 minutes
   */
  return (
    limiter
      .allowRequests(50)
      .every('5 minute')
      .usingKey(`ip_${ctx.request.ip()}`)
      // .blockFor('30 mins')
      .limitExceeded((error) => {
        responseFormatter(HTTP.TOO_MANY_REQUESTS, 'error', error.message)
      })
  )
})
