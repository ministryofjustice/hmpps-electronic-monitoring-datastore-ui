import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityDetailsService } from '../../services'
import { AlchoholMonitoringReportsView } from '../../models/view-models/alcoholMonitoringReports'

export default class IntegritySummaryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly integritySummaryService: IntegrityDetailsService,
  ) {}

  summary: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.INTEGRITY_ORDER_SUMMARY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const orderDetails = await this.integritySummaryService.getOrderDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })
    const backUrl: string = '/integrity'
    const reports: AlchoholMonitoringReportsView = {
      orderDetails: true,
      visitDetails: true,
      equipmentDetails: true,
      suspensionOfVisits: true,
      allEventHistory: true,
      services: true,
    }

    const viewModel = { legacySubjectId, orderDetails, backUrl, reports }
    res.render('pages/integrity/summary', viewModel)
  }
}
