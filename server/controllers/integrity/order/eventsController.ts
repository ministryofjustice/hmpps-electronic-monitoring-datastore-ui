import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../../services/auditService'
import { AuditService, EmDatastoreEventsService } from '../../../services'
// eslint-disable-next-line import/no-named-as-default
import EventsViewModel from '../../../models/view-models/events'

export default class EventsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly eventsService: EmDatastoreEventsService,
  ) {}

  showHistory: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.EVENT_HISTORY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const events = await this.eventsService.getEvents({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = EventsViewModel.construct(parseInt(legacySubjectId, 10), events)

    res.render('pages/order/event-history', viewModel)
  }
}
