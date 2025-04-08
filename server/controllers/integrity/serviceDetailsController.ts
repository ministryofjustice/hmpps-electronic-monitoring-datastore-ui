import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityServiceDetailsService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import IntegrityServiceDetailsModel from '../../models/view-models/integrity/serviceDetails'

export default class IntegrityServiceDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly integrityServiceDetailsService: IntegrityServiceDetailsService,
  ) {}

  showServiceDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.INTEGRITY_SERVICE_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const serviceDetails = await this.integrityServiceDetailsService.getServiceDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = IntegrityServiceDetailsModel.construct(
      parseInt(legacySubjectId, 10),
      `/integrity/${legacySubjectId}`,
      serviceDetails,
    )

    res.render('pages/integrity/service-details', viewModel)
  }
}
