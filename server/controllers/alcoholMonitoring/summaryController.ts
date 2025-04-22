import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringOrderSummaryService } from '../../services'
import { IntegrityReports } from '../../models/integrity/orderSummary'

export default class AlcoholMonitoringSummaryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly summaryService: AlcoholMonitoringOrderSummaryService,
  ) {}

  summary: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.AM_ORDER_SUMMARY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const summary = await this.summaryService.getOrderSummary({
      userToken: res.locals.user.token,
      legacySubjectId,
    })
    const backUrl: string = '/alcohol-monitoring'
    const reports: IntegrityReports = {
      orderDetails: true,
      visitDetails: true,
      equipmentDetails: true,
      suspensionOfVisits: true,
      allEventHistory: true,
      services: true,
    }
    res.render('pages/alcohol-monitoring/summary', { legacySubjectId, summary, backUrl, reports })
  }
}
