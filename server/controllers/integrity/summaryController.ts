import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityOrderDetailsService } from '../../services'
import { IntegrityOrderSummaryView } from '../../models/view-models/integrityOrderSummary'

export default class IntegritySummaryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly integritySummaryService: IntegrityOrderDetailsService,
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

    const viewModel = IntegrityOrderSummaryView.construct(legacySubjectId, orderDetails)
    res.render('pages/integrity/summary', viewModel)
  }
}
