import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegritySuspensionOfVisitsService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import { IntegritySuspensionOfVisitsView } from '../../models/view-models/integritySuspensionOfVisits'

export default class SuspensionOfVisitsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly suspensionOfVisitsService: IntegritySuspensionOfVisitsService,
  ) {}

  showSuspensionOfVisits: RequestHandler = async (req: Request, res: Response) => {
    const { legacySubjectId } = req.params

    const suspensionOfVisitsData = await this.suspensionOfVisitsService.getSuspensionOfVisits({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = IntegritySuspensionOfVisitsView.construct(
      legacySubjectId,
      `/integrity/${legacySubjectId}`,
      suspensionOfVisitsData || [],
    )

    await this.auditService.logPageView(Page.INTEGRITY_SUSPENSION_OF_VISITS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    res.render('pages/integrity/suspension-of-visits', viewModel)
  }
}
