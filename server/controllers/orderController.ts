import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, DatastoreOrderService } from '../services'

import { Reports } from '../interfaces/orderInformation'
import { featureFlags } from '../config'

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
      res.render('pages/orderInformation', { data: orderInformation, backUrl, reports, featureFlags })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  }
}
