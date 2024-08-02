import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import getCurfewHours from '../data/getCurfewHours'
import getEquipmentDetails from '../data/getEquipmentDetails'
import getOrders from '../data/getOrders'
import getOrderSummary from '../data/getOrderSummary'
import getOrderDetails from '../data/getOrderDetails'
import getVisitsAndTasks from '../data/getVisitsAndTasks'
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

  get('/visits-and-tasks', async (req, res, next) => {
    try {
      const visitsAndTasks = await getVisitsAndTasks()
      const tablatedVisitsAndTasks = tablateRecords(visitsAndTasks)
      res.render('pages/twoColumnTable', { data: tablatedVisitsAndTasks })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/equipment-details', async (req, res, next) => {
    try {
      const equipmentDetails = await getEquipmentDetails()
      const tablatedEquipmentDetails = tablateRecords(equipmentDetails)
      res.render('pages/twoColumnTable', { data: tablatedEquipmentDetails })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/curfew-hours', async (req, res, next) => {
    try {
      const curfewHours = await getCurfewHours()
      const tablatedCurfewHours = tablateRecords(curfewHours)
      res.render('pages/twoColumnTable', { data: tablatedCurfewHours })
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
