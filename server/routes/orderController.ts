import type { Request, Response } from 'express'
import AuditService, { Page } from '../services/auditService'
import OrderService from '../services/orderService'
import { Reports } from '../interfaces/orderSummary'

export default class OrderController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
  ) {}

  async getSummary(req: Request, res: Response) {
    await this.auditService.logPageView(Page.ORDER_SUMMARY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })
    try {
      const orderSummary = await this.orderService.getOrderSummary()
      const backUrl: string = '/search/results'
      const reports: Reports = {
        orderDetails: true,
        visitsAndTasks: true,
        eventHistory: true,
        equipmentDetails: true,
        curfewHours: true,
        curfewViolations: true,
        contactHistory: true,
        suspensions: true,
      }
      res.render('pages/orderSummary', { data: orderSummary, backUrl, reports })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  }
}
