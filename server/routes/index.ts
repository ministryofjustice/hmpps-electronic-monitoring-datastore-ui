import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import createTimeline from '../utils/createTimeline'
import getContactHistory from '../data/getContactHistory'
import getCurfewHours from '../data/getCurfewHours'
import getCurfewViolations from '../data/getCurfewViolations'
import getEquipmentDetails from '../data/getEquipmentDetails'
import getEventHistory from '../data/getEventHistory'
import getOrders from '../data/getOrders'
import getOrderSummary from '../data/getOrderSummary'
import getOrderDetails from '../data/getOrderDetails'
import getSuspensions from '../data/getSuspensions'
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
    await auditService.logPageView(Page.START_PAGE, { who: res.locals.user.username, correlationId: req.id })

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
      const tablatedOrderDetails = tablateRecords(orderDetails, 'Order details')
      res.render('pages/twoColumnTable', { data: tablatedOrderDetails })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/visits-and-tasks', async (req, res, next) => {
    try {
      const visitsAndTasks = await getVisitsAndTasks()
      const tablatedVisitsAndTasks = tablateRecords(visitsAndTasks, 'Visits and tasks')
      res.render('pages/twoColumnTable', { data: tablatedVisitsAndTasks })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/equipment-details', async (req, res, next) => {
    try {
      const equipmentDetails = await getEquipmentDetails()
      const tablatedEquipmentDetails = tablateRecords(equipmentDetails, 'Equipment details')
      res.render('pages/twoColumnTable', { data: tablatedEquipmentDetails })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/curfew-hours', async (req, res, next) => {
    try {
      const curfewHours = await getCurfewHours()
      const tablatedCurfewHours = tablateRecords(curfewHours, 'Curfew hours')
      res.render('pages/twoColumnTable', { data: tablatedCurfewHours })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/event-history', async (req, res, next) => {
    try {
      const eventHistory = await getEventHistory()
      const timeline = createTimeline(eventHistory, 'Event history')
      res.render('pages/timeline', { data: timeline })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/suspensions', async (req, res, next) => {
    try {
      const suspensions = await getSuspensions()
      const timeline = createTimeline(suspensions, 'Event history')
      res.render('pages/timeline', { data: timeline })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/curfew-violations', async (req, res, next) => {
    try {
      const curfewViolations = await getCurfewViolations()
      const timeline = createTimeline(curfewViolations, 'Event history')
      res.render('pages/timeline', { data: timeline })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/contact-history', async (req, res, next) => {
    try {
      const contactHistory = await getContactHistory()
      const timeline = createTimeline(contactHistory, 'Event history')
      res.render('pages/timeline', { data: timeline })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  return router
}
