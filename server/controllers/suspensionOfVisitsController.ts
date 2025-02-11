import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, SuspensionOfVisitsService } from '../services'
// eslint-disable-next-line import/no-named-as-default
import SuspensionOfVisitsViewModel from '../models/view-models/suspensionOfVisits'

export default class SuspensionOfVisitsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly suspensionOfVisitsService: SuspensionOfVisitsService,
  ) {}

  showSuspensionOfVisits: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params

    const suspensionOfVisitsData = await this.suspensionOfVisitsService.getSuspensionOfVisits({
      userToken: res.locals.user.token,
      orderId,
    })

    const viewModel = SuspensionOfVisitsViewModel.construct(parseInt(orderId, 10), suspensionOfVisitsData)

    await this.auditService.logPageView(Page.SUSPENSION_OF_VISITS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    res.render('pages/suspensionOfVisits', viewModel)
  }
}
