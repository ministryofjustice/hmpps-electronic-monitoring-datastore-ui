import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringEquipmentDetailsService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import { AlcoholMonitoringEquipmentDetailsView } from '../../models/view-models/alcoholMonitoringEquipmentDetails'

export default class AlcoholMonitoringEquipmentDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly alcoholMonitoringEquipmentDetailsService: AlcoholMonitoringEquipmentDetailsService,
  ) {}

  showEquipmentDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.AM_EQUIPMENT_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const equipmentDetails = await this.alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = AlcoholMonitoringEquipmentDetailsView.construct(
      legacySubjectId,
      `/orders/alcohol-monitoring/${legacySubjectId}`,
      equipmentDetails,
    )

    res.render('pages/alcohol-monitoring/equipment-details', viewModel)
  }
}
