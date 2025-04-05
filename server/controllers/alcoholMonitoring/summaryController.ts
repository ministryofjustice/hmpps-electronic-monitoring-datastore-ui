import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringSummaryService } from '../../services'
import { Reports } from '../../interfaces/orderInformation'

export default class AlcoholMonitoringSummaryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly summaryService: AlcoholMonitoringSummaryService,
  ) {}

  summary: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.ORDER_INFORMATION_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const summary = await this.summaryService.getSummary({
      userToken: res.locals.user.token,
      legacySubjectId,
    })
    const backUrl: string = '/alcohol-monitoring'
    const reports: Reports = {
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
