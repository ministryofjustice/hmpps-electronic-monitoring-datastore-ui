import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityOrderSummaryService } from '../../services'
import { IntegrityReports } from '../../models/integrity/orderSummary'

export default class IntegritySummaryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly integritySummaryService: IntegrityOrderSummaryService,
  ) {}

  summary: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.INTEGRITY_ORDER_SUMMARY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const orderInformation = await this.integritySummaryService.getOrderSummary({
      userToken: res.locals.user.token,
      legacySubjectId,
    })
    const backUrl: string = '/integrity'
    const reports: IntegrityReports = {
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
