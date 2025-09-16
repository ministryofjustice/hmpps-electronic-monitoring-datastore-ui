import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringServiceDetailsService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import { AlcoholMonitoringServiceDetailsView } from '../../models/view-models/alcoholMonitoringServiceDetails'

export default class AlcoholMonitoringServiceDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly alcoholMonitoringServiceDetailsService: AlcoholMonitoringServiceDetailsService,
  ) {}

  showServiceDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.AM_SERVICE_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const serviceDetails = await this.alcoholMonitoringServiceDetailsService.getServiceDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = AlcoholMonitoringServiceDetailsView.construct(
      legacySubjectId,
      `/orders/alcohol-monitoring/${legacySubjectId}`,
      serviceDetails,
    )

    res.render('pages/alcohol-monitoring/service-details', viewModel)
  }
}
