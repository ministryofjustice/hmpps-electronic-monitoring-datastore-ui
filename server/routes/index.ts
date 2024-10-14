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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ auditService, searchService, orderService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    await auditService.logPageView(Page.START_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/index')
  })

  get('/search', async (req, res, next) => {
    await auditService.logPageView(Page.SEARCH_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/search')
  })

  get('/search-results', async (req, res, next) => {
    await auditService.logPageView(Page.SEARCH_RESULTS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const orders = await searchService.getOrders()
      const tabulatedOrders = tabluateOrders(orders)
      res.render('pages/searchResults', { data: tabulatedOrders })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/order-summary', async (req, res, next) => {
    await auditService.logPageView(Page.ORDER_SUMMARY_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const orderSummary = await orderService.getOrderSummary()
      res.render('pages/orderSummary', { data: orderSummary })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/order-details', async (req, res, next) => {
    await auditService.logPageView(Page.ORDER_DETAILS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const orderDetails = await getOrderDetails()
      const tabulatedOrderDetails = tabluateRecords(orderDetails, 'Order details')
      res.render('pages/twoColumnTable', { data: tabulatedOrderDetails })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/visits-and-tasks', async (req, res, next) => {
    await auditService.logPageView(Page.VISITS_AND_TASKS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const visitsAndTasks = await getVisitsAndTasks()
      const tabulatedVisitsAndTasks = tabluateRecords(visitsAndTasks, 'Visits and tasks')
      res.render('pages/twoColumnTable', { data: tabulatedVisitsAndTasks })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/equipment-details', async (req, res, next) => {
    await auditService.logPageView(Page.EQUIPMENT_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    try {
      const equipmentDetails = await getEquipmentDetails()
      const tabulatedEquipmentDetails = tabluateRecords(equipmentDetails, 'Equipment details')
      res.render('pages/twoColumnTable', { data: tabulatedEquipmentDetails })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/curfew-hours', async (req, res, next) => {
    await auditService.logPageView(Page.CURFEW_HOURS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const curfewHours = await getCurfewHours()
      const tabulatedCurfewHours = tabluateRecords(curfewHours, 'Curfew hours')
      res.render('pages/twoColumnTable', { data: tabulatedCurfewHours })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/event-history', async (req, res, next) => {
    await auditService.logPageView(Page.EVENT_HISTORY_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const eventHistory = await getEventHistory()
      const timeline = createTimeline(eventHistory, 'Event history')
      res.render('pages/timeline', { data: timeline })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/suspensions', async (req, res, next) => {
    await auditService.logPageView(Page.SUSPENSIONS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const suspensions = await getSuspensions()
      const timeline = createTimeline(suspensions, 'Suspension of visits')
      res.render('pages/timeline', { data: timeline })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/curfew-violations', async (req, res, next) => {
    await auditService.logPageView(Page.CURFEW_VIOLATIONS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    try {
      const curfewViolations = await getCurfewViolations()
      const timeline = createTimeline(curfewViolations, 'Violations')
      res.render('pages/timeline', { data: timeline })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/contact-history', async (req, res, next) => {
    await auditService.logPageView(Page.CONTACT_HISTORY_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const contactHistory = await getContactHistory()
      const timeline = createTimeline(contactHistory, 'Contact history')
      res.render('pages/timeline', { data: timeline })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  return router
}
