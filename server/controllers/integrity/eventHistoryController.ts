import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityEventHistoryService } from '../../services'
// eslint-disable-next-line import/no-named-as-default
import { IntegrityEventHistoryView } from '../../models/view-models/integrityEventHistory'
import paths from '../../constants/paths'
import { buildUrl } from '../../utils/utils'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'

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
    const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

    const eventHistory = await this.integrityEventHistoryService.getEventHistory({
      userToken: res.locals.user.token,
      legacySubjectId,
      restricted,
    })

    const viewModel = IntegrityEventHistoryView.construct(
      legacySubjectId,
      buildUrl(paths.INTEGRITY_ORDER.SUMMARY, { legacySubjectId }),
      eventHistory,
    )

    res.render('pages/integrity/event-history', viewModel)
  }
}
