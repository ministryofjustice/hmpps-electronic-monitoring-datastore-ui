import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringDetailsService } from '../../services'

export default class OrderDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly alcoholMonitoringDetailsService: AlcoholMonitoringDetailsService,
  ) {}

  details: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.AM_ORDER_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const orderDetails = await this.alcoholMonitoringDetailsService.getDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    res.render('pages/alcohol-monitoring/details', {
      legacySubjectId,
      backUrl: `/alcohol-monitoring/${legacySubjectId}`,
      details: orderDetails,
    })
  }
}
