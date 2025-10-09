import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityEquipmentDetailsService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import { IntegrityEquipmentDetailsView } from '../../models/view-models/integrityEquipmentDetails'
import paths from '../../constants/paths'
import { buildUrl } from '../../utils/utils'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'

export default class IntegrityEquipmentDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly integrityEquipmentDetailsService: IntegrityEquipmentDetailsService,
  ) {}

  showEquipmentDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.INTEGRITY_EQUIPMENT_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params
    const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

    const equipmentDetails = await this.integrityEquipmentDetailsService.getEquipmentDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
      restricted,
    })

    const viewModel = IntegrityEquipmentDetailsView.construct(
      legacySubjectId,
      buildUrl(paths.INTEGRITY_ORDER.SUMMARY, { legacySubjectId }),
      equipmentDetails,
    )

    res.render('pages/integrity/equipment-details', viewModel)
  }
}
