import type { Request, Response } from 'express'
import AuditService, { Page } from '../services/auditService'
import OrderService from '../services/orderService'
import { Reports } from '../interfaces/orderInformation'

export default class OrderController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
  ) {}

  async getSummary(req: Request, res: Response) {
    await this.auditService.logPageView(Page.ORDER_INFORMATION_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })
    try {
      const orderInformation = await this.orderService.getOrderInformation()
      const backUrl: string = '/search/results'
      const reports: Reports = {
        orderDetails: true,
        visitDetails: true,
        // visitsAndTasks: true,
        // eventHistory: true,
        equipmentDetails: true,
        // curfewHours: true,
        // curfewViolations: true,
        // contactHistory: true,
        // suspensions: true,
        suspensionOfVisits: true,
        allEventHistory: true,
        services: true,
      }
      res.render('pages/orderInformation', { data: orderInformation, backUrl, reports })
    } catch (error) {
      res.status(500).send('Error fetching data')
    }
  }
}
