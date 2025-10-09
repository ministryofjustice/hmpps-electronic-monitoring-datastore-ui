import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringOrderDetailsService } from '../../services'
import { AlcoholMonitoringOrderSummaryView } from '../../models/view-models/alcoholMonitoringOrderSummary'

export default class AlcoholMonitoringSummaryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly detailsService: AlcoholMonitoringOrderDetailsService,
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

    const viewModel = AlcoholMonitoringOrderSummaryView.construct(legacySubjectId, orderDetails)
    res.render('pages/alcohol-monitoring/summary', viewModel)
  }
}
