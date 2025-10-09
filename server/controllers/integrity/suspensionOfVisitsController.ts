import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegritySuspensionOfVisitsService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import { IntegritySuspensionOfVisitsView } from '../../models/view-models/integritySuspensionOfVisits'
import paths from '../../constants/paths'
import { buildUrl } from '../../utils/utils'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'

export default class SuspensionOfVisitsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly suspensionOfVisitsService: IntegritySuspensionOfVisitsService,
  ) {}

  showSuspensionOfVisits: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.INTEGRITY_SUSPENSION_OF_VISITS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params
    const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

    const suspensionOfVisitsData = await this.suspensionOfVisitsService.getSuspensionOfVisits({
      userToken: res.locals.user.token,
      legacySubjectId,
      restricted,
    })

    const viewModel = IntegritySuspensionOfVisitsView.construct(
      legacySubjectId,
      buildUrl(paths.INTEGRITY_ORDER.SUMMARY, { legacySubjectId }),
      suspensionOfVisitsData || [],
    )

    res.render('pages/integrity/suspension-of-visits', viewModel)
  }
}
