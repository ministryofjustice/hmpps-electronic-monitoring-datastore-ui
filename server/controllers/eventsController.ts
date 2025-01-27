import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, EventsService } from '../services'
// eslint-disable-next-line import/no-named-as-default
import EventsViewModel from '../models/view-models/events'

export default class EventsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly eventsService: EventsService,
  ) {}

  showHistory: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params

    const events = await this.eventsService.getEvents({
      accessToken: res.locals.user.token,
      orderId,
    })

    const viewModel = EventsViewModel.construct(parseInt(orderId, 10), events)

    await this.auditService.logPageView(Page.EVENT_HISTORY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    res.render('pages/order/event-history', viewModel)
  }
}
