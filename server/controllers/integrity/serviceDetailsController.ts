import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityServiceDetailsService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import { IntegrityServiceDetailsView } from '../../models/view-models/integrityServiceDetails'
import paths from '../../constants/paths'
import { buildUrl } from '../../utils/utils'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'

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
    const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

    const serviceDetails = await this.integrityServiceDetailsService.getServiceDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
      restricted,
    })

    const viewModel = IntegrityServiceDetailsView.construct(
      legacySubjectId,
      buildUrl(paths.INTEGRITY_ORDER.SUMMARY, { legacySubjectId }),
      serviceDetails,
    )

    res.render('pages/integrity/service-details', viewModel)
  }
}
