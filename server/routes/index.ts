import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import createTimeline from '../utils/createTimeline'
import getContactHistory from '../data/getContactHistory'
import getCurfewHours from '../data/getCurfewHours'
import getCurfewViolations from '../data/getCurfewViolations'
import getEquipmentDetails from '../data/getEquipmentDetails'
import getEventHistory from '../data/getEventHistory'
import getOrderDetails from '../data/getOrderDetails'
import getSuspensions from '../data/getSuspensions'
import getVisitsAndTasks from '../data/getVisitsAndTasks'
import tabluateOrders from '../utils/tabulateOrders'
import tabluateRecords from '../utils/tabulateRecords'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import searchRouter from './searchRouter'
import orderRouter from './orderRouter'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    await services.auditService.logPageView(Page.START_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/index')
  })

  router.use('/search', searchRouter(services))
  router.use('/orders', orderRouter(services))

  return router
}
