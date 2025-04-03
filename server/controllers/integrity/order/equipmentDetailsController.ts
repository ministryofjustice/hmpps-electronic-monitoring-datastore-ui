import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../../services/auditService'
import { AuditService, EmDatastoreEquipmentDetailsService } from '../../../services'
// eslint-disable-next-line import/no-named-as-default
import EquipmentDetailsModel from '../../../models/view-models/equipmentDetails'

export default class EquipmentDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly equipmentDetailsService: EmDatastoreEquipmentDetailsService,
  ) {}

  showEquipmentDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.EQUIPMENT_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const equipmentDetails = await this.equipmentDetailsService.getEquipmentDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = EquipmentDetailsModel.construct(
      parseInt(legacySubjectId, 10),
      `/integrity/${legacySubjectId}`,
      equipmentDetails,
    )

    res.render('pages/integrity/equipment-details', viewModel)
  }
}
