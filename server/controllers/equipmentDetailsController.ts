import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, EmDatastoreEquipmentDetailsService } from '../services'
// eslint-disable-next-line import/no-named-as-default
import EquipmentDetailsModel from '../models/view-models/equipmentDetails'

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

    const { orderId } = req.params

    const equipmentDetails = await this.equipmentDetailsService.getEquipmentDetails({
      userToken: res.locals.user.token,
      orderId,
    })

    const viewModel = EquipmentDetailsModel.construct(parseInt(orderId, 10), equipmentDetails)

    res.render('pages/order/equipment-details', viewModel)
  }
}
