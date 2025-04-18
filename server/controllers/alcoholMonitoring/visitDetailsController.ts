import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringVisitDetailsService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import AlcoholMonitoringVisitDetailsModel from '../../models/view-models/alcoholMonitoring/visitDetails'

export default class AlcoholMonitoringVisitDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly visitDetailsService: AlcoholMonitoringVisitDetailsService,
  ) {}

  showVisitDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.AM_VISIT_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const visitDetails = await this.visitDetailsService.getVisitDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = AlcoholMonitoringVisitDetailsModel.construct(
      legacySubjectId,
      `/orders/alcohol-monitoring/${legacySubjectId}`,
      visitDetails,
    )

    res.render('pages/alcohol-monitoring/visit-details', viewModel)
  }
}
