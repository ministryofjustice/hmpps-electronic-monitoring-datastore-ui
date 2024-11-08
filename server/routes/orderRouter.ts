import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import createTimeline from '../utils/createTimeline'
import getContactHistory from '../data/getContactHistory'
import getCurfewHours from '../data/getCurfewHours'
import getCurfewViolations from '../data/getCurfewViolations'
import getEquipmentDetails from '../data/getEquipmentDetails'
import getEventHistory from '../data/getEventHistory'
import getOrderDetails from '../data/getOrderDetails'
import getDeviceWearerDetails from '../data/getDeviceWearer'
import getSuspensions from '../data/getSuspensions'
import getVisitsAndTasks from '../data/getVisitsAndTasks'
import tabluateRecords from '../utils/tabulateRecords'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import OrderController from './orderController'

export default function orderRouter({ auditService, orderService }: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const orderController = new OrderController(auditService, orderService)

  get('/information', async (req, res, next) => orderController.getSummary(req, res))

  // // Possibly better approach for unit testing
  // get('/summary', async (req, res, next) => {
  //   await auditService.logPageView(Page.ORDER_DETAILS_PAGE, { who: res.locals.user.username, correlationId: req.id })

  //   const param1 = req.params.param1WhichIsFake
  //   const param2 = req.params.param2WhichIsFake

  //   try {
  //     let myDataObj = orderController.getSummary(param1, param2)
  //     res.render('page', {data: myDataObj})
  //   } catch (error) {
  //     res.status(500).send('Error fetching data')
  //   }

  // })

  get('/details', async (req, res, next) => {
    await auditService.logPageView(Page.ORDER_DETAILS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params

      const orderDetails = await getOrderDetails()
      const deviceWearerDetails = await getDeviceWearerDetails()

      const tabulatedOrderDetails = tabluateRecords(orderDetails, 'Order Data')
      const tabulatedDeviceWearerDetails = tabluateRecords(deviceWearerDetails, 'Device Wearer Data')

      res.render('pages/orderDetails', {
        deviceWearer: tabulatedDeviceWearerDetails,
        orderDetails: tabulatedOrderDetails,
        backUrl: `/orders/${orderId}/information`,
      })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/visits-and-tasks', async (req, res, next) => {
    await auditService.logPageView(Page.VISITS_AND_TASKS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params
      const visitsAndTasks = await getVisitsAndTasks()
      const tabulatedVisitsAndTasks = tabluateRecords(visitsAndTasks, 'Visits and tasks')
      res.render('pages/twoColumnTable', { data: tabulatedVisitsAndTasks, backUrl: `/orders/${orderId}/information` })
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
      const { orderId } = req.params
      const equipmentDetails = await getEquipmentDetails()
      const tabulatedEquipmentDetails = tabluateRecords(equipmentDetails, 'Equipment details')
      res.render('pages/twoColumnTable', { data: tabulatedEquipmentDetails, backUrl: `/orders/${orderId}/information` })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/curfew-hours', async (req, res, next) => {
    await auditService.logPageView(Page.CURFEW_HOURS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params
      const curfewHours = await getCurfewHours()
      const tabulatedCurfewHours = tabluateRecords(curfewHours, 'Curfew hours')
      res.render('pages/twoColumnTable', { data: tabulatedCurfewHours, backUrl: `/orders/${orderId}/information` })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/event-history', async (req, res, next) => {
    await auditService.logPageView(Page.EVENT_HISTORY_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params
      const eventHistory = await getEventHistory()
      const timeline = createTimeline(eventHistory, 'Event history')
      res.render('pages/timeline', { data: timeline, backUrl: `/orders/${orderId}/information` })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/suspensions', async (req, res, next) => {
    await auditService.logPageView(Page.SUSPENSIONS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params
      const suspensions = await getSuspensions()
      const timeline = createTimeline(suspensions, 'Suspension of visits')
      res.render('pages/timeline', { data: timeline, backUrl: `/orders/${orderId}/information` })
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
      const { orderId } = req.params
      const curfewViolations = await getCurfewViolations()
      const timeline = createTimeline(curfewViolations, 'Violations')
      res.render('pages/timeline', { data: timeline, backUrl: `/orders/${orderId}/information` })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  get('/contact-history', async (req, res, next) => {
    await auditService.logPageView(Page.CONTACT_HISTORY_PAGE, { who: res.locals.user.username, correlationId: req.id })

    try {
      const { orderId } = req.params
      const contactHistory = await getContactHistory()
      const timeline = createTimeline(contactHistory, 'Contact history')
      res.render('pages/timeline', { data: timeline, backUrl: `/orders/${orderId}/information` })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  })

  return router
}
