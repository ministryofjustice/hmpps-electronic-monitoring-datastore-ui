import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import searchRouter from './searchRouter'
import orderRouter from './orderRouter'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  // TODO: Define controller expressions here
  // Have two controllers - searchController and orderController

  /**
   * With a controller I need to pass services via di:
   *  - auditService
   *  - relevant Service
   */

  get('/', async (req, res, next) => {
    await services.auditService.logPageView(Page.START_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/index')
  })

  get('/test-api', async (req, res, next) => {
    const { token } = res.locals.user
    const apiResult: JSON = await services.emDatastoreConnectionService.test(token)
    res.render('pages/apiTest', { data: JSON.stringify(apiResult) })
  })

  router.use('/search', searchRouter(services))
  router.use('/orders/:orderId', orderRouter(services))

  return router
}
