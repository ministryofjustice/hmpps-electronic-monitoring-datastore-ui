import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringEventHistoryService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import AlcoholMonitoringEventHistoryViewModel from '../../models/view-models/alcoholMonitoring/eventHistory'

export default class AlcoholMonitoringEventHistoryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly alcoholMonitoringEventHistoryService: AlcoholMonitoringEventHistoryService,
  ) {}

  showEventHistory: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.AM_EVENT_HISTORY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const events = await this.alcoholMonitoringEventHistoryService.getEventHistory({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = AlcoholMonitoringEventHistoryViewModel.construct(
      parseInt(legacySubjectId, 10),
      `/alcohol-monitoring/${legacySubjectId}`,
      events,
    )

    res.render('pages/alcohol-monitoring/event-history', viewModel)
  }
}
