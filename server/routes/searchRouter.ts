import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import tabluateOrders from '../utils/tabulateOrders'

export default function searchRouter({ auditService, searchService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    await auditService.logPageView(Page.SEARCH_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/search')
  })

  get('/results', async (req, res, next) => {
    await auditService.logPageView(Page.SEARCH_RESULTS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const orders = await searchService.getOrders()
      const tabulatedOrders = tabluateOrders(orders)
      res.render('pages/searchResults', { data: tabulatedOrders })
    } catch {
      res.status(500).send('Error fetching data')
    }
  })

  return router
}
