import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, SuspensionOfVisitsService } from '../services'

import SuspensionOfVisitsViewModel from '../models/view-models/suspensionOfVisits'

export default class SuspensionOfVisitsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly suspensionOfVisitsService: SuspensionOfVisitsService,
  ) {}

  showSuspensionOfVisits: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params

    const suspensionOfVisitsEvents = await this.suspensionOfVisitsService.getSuspensionOfVisitsEvents({
      accessToken: res.locals.user.token,
      orderId,
    })

    const viewModel = SuspensionOfVisitsViewModel.construct(parseInt(orderId, 10), suspensionOfVisitsEvents)

    await this.auditService.logPageView(Page.SUSPENSION_OF_VISITS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    res.render('pages/order/suspension-of-visits', viewModel)
  }
}
