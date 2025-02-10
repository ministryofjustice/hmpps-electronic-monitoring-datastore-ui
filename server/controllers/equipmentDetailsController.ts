import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, EquipmentDetailsService } from '../services'
// eslint-disable-next-line import/no-named-as-default
import EquipmentDetailsModel from '../models/view-models/equipmentDetails'

export default class EquipmentDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly equipmentDetailsService: EquipmentDetailsService,
  ) {}

  showEquipmentDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.EQUIPMENT_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { orderId } = req.params

    const equipmentDetails = await this.equipmentDetailsService.getEquipmentDetails({
      accessToken: res.locals.user.token,
      orderId,
    })

    console.log(equipmentDetails)

    const viewModel = EquipmentDetailsModel.construct(parseInt(orderId, 10), equipmentDetails)

    console.log(viewModel)

    res.render('pages/order/equipment-details', viewModel)
  }
}
