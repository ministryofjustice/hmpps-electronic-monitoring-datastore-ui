import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, EmDatastoreOrderSummaryService } from '../../services'
import { Reports } from '../../interfaces/orderInformation'

export default class OrderSummaryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly emDatastoreOrderSummaryService: EmDatastoreOrderSummaryService,
  ) {}

  orderSummary: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.ORDER_INFORMATION_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const orderInformation = await this.emDatastoreOrderSummaryService.getOrderSummary({
      userToken: res.locals.user.token,
      legacySubjectId,
    })
    const backUrl: string = '/integrity'
    const reports: Reports = {
      orderDetails: true,
      visitDetails: true,
      equipmentDetails: true,
      suspensionOfVisits: true,
      allEventHistory: true,
      services: true,
    }
    res.render('pages/integrity/summary', { legacySubjectId, data: orderInformation, backUrl, reports })
  }
}
