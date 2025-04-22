import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityEventHistoryService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import IntegrityEventHistoryViewModel from '../../models/view-models/integrity/eventHistory'

export default class IntegrityEventHistoryController {
  constructor(
    private readonly auditService: AuditService,
    private readonly integrityEventHistoryService: IntegrityEventHistoryService,
  ) {}

  showEventHistory: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.INTEGRITY_EVENT_HISTORY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const eventHistory = await this.integrityEventHistoryService.getEventHistory({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = IntegrityEventHistoryViewModel.construct(
      legacySubjectId,
      `/integrity/${legacySubjectId}`,
      eventHistory,
    )

    res.render('pages/integrity/event-history', viewModel)
  }
}
