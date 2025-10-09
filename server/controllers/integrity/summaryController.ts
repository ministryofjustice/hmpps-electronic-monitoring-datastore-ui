import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityOrderDetailsService } from '../../services'
import { IntegrityOrderSummaryView } from '../../models/view-models/integrityOrderSummary'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'

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
    const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

    const orderDetails = await this.integritySummaryService.getOrderDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
      restricted,
    })

    const viewModel = IntegrityOrderSummaryView.construct(legacySubjectId, orderDetails)
    res.render('pages/integrity/summary', viewModel)
  }
}
