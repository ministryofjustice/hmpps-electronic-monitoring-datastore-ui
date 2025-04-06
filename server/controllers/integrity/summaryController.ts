import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegritySummaryService } from '../../services'
import { Reports } from '../../interfaces/orderInformation'

export default class IntegritySummaryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly integritySummaryService: IntegritySummaryService,
  ) {}

  summary: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.ORDER_INFORMATION_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const orderInformation = await this.integritySummaryService.getSummary({
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
