import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, EmDatastoreVisitDetailsService } from '../services'
// eslint-disable-next-line import/no-named-as-default
import VisitDetailsModel from '../models/view-models/visitDetails'

export default class VisitDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly visitDetailsService: EmDatastoreVisitDetailsService,
  ) {}

  showVisitDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.VISIT_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const visitDetails = await this.visitDetailsService.getVisitDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = VisitDetailsModel.construct(parseInt(legacySubjectId, 10), visitDetails)

    res.render('pages/order/visit-details', viewModel)
  }
}
