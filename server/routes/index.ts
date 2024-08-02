import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import getOrders from '../data/getOrders'
import getOrderSummary from '../data/getOrderSummary'
import getOrderDetails from '../data/getOrderDetails'
import tablateOrders from '../utils/tablateOrders'
import tablateRecords from '../utils/tablateRecords'
import type { Services } from '../services'
// import { Page } from '../services/auditService'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ auditService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/index')
  })

  get('/search', async (req, res, next) => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/search')
  })

  get('/search-results', async (req, res, next) => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const orders = await getOrders()
      const tablatedOrders = tablateOrders(orders)
      res.render('pages/searchResults', { data: tablatedOrders })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/order-summary', async (req, res, next) => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const orderSummary = await getOrderSummary()
      res.render('pages/orderSummary', { data: orderSummary })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/order-details', async (req, res, next) => {
    try {
      const orderDetails = await getOrderDetails()
      const tablatedOrderDetails = tablateRecords(orderDetails)
      res.render('pages/twoColumnTable', { data: tablatedOrderDetails })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/timeline', async (req, res, next) => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    res.render('pages/timeline')
  })

  return router
}
