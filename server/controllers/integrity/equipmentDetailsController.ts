import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityEquipmentDetailsService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import { IntegrityEquipmentDetailsView } from '../../models/view-models/integrityEquipmentDetails'

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

    const equipmentDetails = await this.integrityEquipmentDetailsService.getEquipmentDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = IntegrityEquipmentDetailsView.construct(
      legacySubjectId,
      `/integrity/${legacySubjectId}`,
      equipmentDetails,
    )

    res.render('pages/integrity/equipment-details', viewModel)
  }
}
