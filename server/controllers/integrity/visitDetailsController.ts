import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityVisitDetailsService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import IntegrityVisitDetailsModel from '../../models/view-models/integrity/visitDetails'

export default class IntegrityVisitDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly visitDetailsService: IntegrityVisitDetailsService,
  ) {}

  showVisitDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.INTEGRITY_VISIT_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const visitDetails = await this.visitDetailsService.getVisitDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = IntegrityVisitDetailsModel.construct(
      parseInt(legacySubjectId, 10),
      `/integrity/${legacySubjectId}`,
      visitDetails,
    )

    res.render('pages/integrity/visit-details', viewModel)
  }
}
