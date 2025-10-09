import type { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityOrderDetailsService } from '../../services'
import { IntegritySearchResultView } from '../../models/view-models/integritySearchResults'
import { IntegrityOrderDetailsView } from '../../models/view-models/integrityOrderDetails'

export default class IntegrityOrderDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly integrityDetailsService: IntegrityOrderDetailsService,
  ) {}

  details: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.INTEGRITY_ORDER_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params
    const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

    const orderDetails = await this.integrityDetailsService.getOrderDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
      restricted,
    })

    const viewModel = IntegrityOrderDetailsView.construct(legacySubjectId, orderDetails)
    res.render('pages/integrity/details', viewModel)
  }

  searchResults: RequestHandler = async (req: Request, res: Response, next) => {
    await this.auditService.logPageView(Page.SEARCH_RESULTS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const queryExecutionId = req.query.search_id as string
    const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

    if (!queryExecutionId) {
      res.redirect(paths.SEARCH)
      return
    }

    try {
      const orders = await this.integrityDetailsService.getSearchResults({
        userToken: res.locals.user.token,
        queryExecutionId,
        restricted,
      })

      const viewModel = IntegritySearchResultView.construct(orders)

      res.render('pages/searchResults', { viewModel, orderType: 'integrity' })
    } catch (error) {
      if (error.message === 'Error retrieving search results: Invalid query execution ID') {
        res.redirect(paths.SEARCH)
        return
      }

      next(error)
    }
  }
}
