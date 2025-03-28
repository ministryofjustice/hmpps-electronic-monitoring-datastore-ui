import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, EmDatastoreCurfewTimetableService } from '../services'
// eslint-disable-next-line import/no-named-as-default
import CurfewTimetableModel from '../models/view-models/curfewTimetable'

export default class CurfewTimetableController {
  constructor(
    private readonly auditService: AuditService,
    private readonly curfewTimetableService: EmDatastoreCurfewTimetableService,
  ) {}

  showCurfewTimetable: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.CURFEW_TIMETABLE_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { orderId } = req.params

    const curfewTimetable = await this.curfewTimetableService.getCurfewTimetable({
      userToken: res.locals.user.token,
      orderId,
    })

    const viewModel = CurfewTimetableModel.construct(parseInt(orderId, 10), curfewTimetable)

    res.render('pages/order/curfew-timetable', viewModel)
  }
}
