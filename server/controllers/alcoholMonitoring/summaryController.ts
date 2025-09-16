import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringDetailsService } from '../../services'
import { AlchoholMonitoringReportsView } from '../../models/view-models/alcoholMonitoringReports'

export default class AlcoholMonitoringSummaryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly detailsService: AlcoholMonitoringDetailsService,
  ) {}

  summary: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.AM_ORDER_SUMMARY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const orderDetails = await this.detailsService.getOrderDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })
    const backUrl: string = '/alcohol-monitoring'
    const reports: AlchoholMonitoringReportsView = {
      orderDetails: true,
      visitDetails: true,
      equipmentDetails: true,
      suspensionOfVisits: true,
      allEventHistory: true,
      services: true,
    }

    const viewModel = { legacySubjectId, orderDetails, backUrl, reports }
    res.render('pages/alcohol-monitoring/summary', viewModel)
  }
}
