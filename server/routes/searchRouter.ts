import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import tabulateOrders from '../utils/tabulateOrders'
import { Order } from '../interfaces/order'
import SearchController from '../controllers/searchController'

export default function searchRouter({ auditService, datastoreSearchService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const searchController = new SearchController(auditService, datastoreSearchService)

  get('/', searchController.search)
  post('/', searchController.view)

  return router
}
