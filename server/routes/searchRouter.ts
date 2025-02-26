import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'

import SearchController from '../controllers/searchController'

export default function searchRouter({ auditService, searchService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const searchController = new SearchController(auditService, searchService)

  get('/', searchController.searchPage)
  post('/', searchController.submitSearchQuery)
  get('/orders', searchController.searchResultsPage)

  return router
}
