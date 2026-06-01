import type { Request, RequestHandler, Response } from 'express'
import AuditService, { Page } from '../../services/auditService'
import AlcoholMonitoringVisitDetailsService from '../../services/alcoholMonitoring/visitDetailsService'

import { AlcoholMonitoringVisitDetailsView } from '../../models/view-models/alcoholMonitoringVisitDetails'
import paths from '../../constants/paths'
import { buildUrl } from '../../utils/utils'

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

    const legacySubjectId = req.params.legacySubjectId as string

    const visitDetails = await this.visitDetailsService.getVisitDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = AlcoholMonitoringVisitDetailsView.construct(
      legacySubjectId,
      buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId }),
      visitDetails,
    )

    res.render('pages/alcohol-monitoring/visit-details', viewModel)
  }
}
