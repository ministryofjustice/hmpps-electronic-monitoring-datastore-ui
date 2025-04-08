import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityDetailsService } from '../../services'

export default class IntegrityDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly integrityDetailsService: IntegrityDetailsService,
  ) {}

  details: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.INTEGRITY_ORDER_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const orderDetails = await this.integrityDetailsService.getDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    res.render('pages/integrity/details', {
      legacySubjectId,
      backUrl: `/integrity/${legacySubjectId}`,
      details: orderDetails,
    })
  }
}
