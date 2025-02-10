import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, SuspensionOfVisitsService } from '../services'
// eslint-disable-next-line import/no-named-as-default
import SuspensionOfVisitsModel from '../models/view-models/suspensionOfVisits'

export default class SuspensionOfVisitsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly suspensionOfVisitsService: SuspensionOfVisitsService,
  ) {}

  showSuspensionOfVisits: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.SUSPENSION_OF_VISITS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { orderId } = req.params

    const suspensionOfVisits = await this.suspensionOfVisitsService.getSuspensionOfVisits({
      accessToken: res.locals.user.token,
      orderId,
    })

    const viewModel = SuspensionOfVisitsModel.construct(parseInt(orderId, 10), suspensionOfVisits)

    res.render('pages/order/suspension-of-visits', viewModel)
  }
}
