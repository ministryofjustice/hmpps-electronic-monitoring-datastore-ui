import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import tabluateOrders from '../utils/tabulateOrders'
import { Order } from '../interfaces/order'
import SearchController from '../controllers/searchController'

export default function searchRouter({ auditService, datastoreSearchService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const searchController = new SearchController(auditService, datastoreSearchService)

  // get('/', async (req, res, next) => {
  //   await auditService.logPageView(Page.SEARCH_PAGE, { who: res.locals.user.username, correlationId: req.id })

  //   res.render('pages/search')
  // })

  get('/', searchController.search)
  post('/', searchController.view)

  get('/results', async (req, res, next) => {
    // TODO: replace this with FormData object
    const searchItem: Order = {
      dataType: 'am',
      legacySubjectId: 1,
    }
    await auditService.logPageView(Page.SEARCH_RESULTS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const orders = await datastoreSearchService.searchForOrders(searchItem)
      const tabulatedOrders = tabluateOrders(orders)
      res.render('pages/searchResults', { data: tabulatedOrders })
    } catch {
      res.status(500).send('Error fetching data')
    }
  })

  return router
}
