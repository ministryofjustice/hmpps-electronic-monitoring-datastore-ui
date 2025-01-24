import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, DatastoreOrderService } from '../services'
import { Reports } from '../interfaces/orderInformation'
import tabluateRecords from '../utils/tabulateRecords'

import { Records, TabulatedRecords } from '../interfaces/records'

export default class OrderController {
  constructor(
    private readonly auditService: AuditService,
    private readonly datastoreOrderService: DatastoreOrderService,
  ) {}

  orderSummary: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.ORDER_INFORMATION_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { orderId } = req.params

    try {
      const orderInformation = await this.datastoreOrderService.getOrderSummary({
        userToken: res.locals.user.token,
        orderId,
      })
      const backUrl: string = '/search/results'
      const reports: Reports = {
        orderDetails: true,
        visitDetails: true,
        equipmentDetails: true,
        suspensionOfVisits: true,
        allEventHistory: true,
        services: true,
      }
      res.render('pages/orderInformation', { data: orderInformation, backUrl, reports })
    } catch {
      res.status(500).send('Error fetching data')
    }
  }

  orderDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.ORDER_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { orderId } = req.params

    try {
      // Call service
      const orderDetails: Records = await this.datastoreOrderService.getOrderDetails({
        userToken: res.locals.user.token,
        orderId,
      })
      const deviceWearerDetails: Records = await this.datastoreOrderService.getDeviceWearerDetails({
        userToken: res.locals.user.token,
        orderId,
      })

      // Do some formatting?
      const tabulatedOrderDetails: TabulatedRecords = tabluateRecords(orderDetails, 'Order Data')
      const tabulatedDeviceWearerDetails: TabulatedRecords = tabluateRecords(deviceWearerDetails, 'Device Wearer Data')

      // Do some rendering
      res.render('pages/orderDetails', {
        deviceWearer: tabulatedDeviceWearerDetails,
        orderDetails: tabulatedOrderDetails,
        backUrl: `/orders/${orderId}/information`,
      })
    } catch {
      res.status(500).send('Error fetching data')
    }
  }
}
