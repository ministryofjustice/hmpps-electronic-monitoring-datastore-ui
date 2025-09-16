import type { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { Page } from '../../services/auditService'
import { AuditService, IntegrityDetailsService } from '../../services'
import { IntegritySearchResultView } from '../../models/view-models/integritySearchResults'

export default class IntegrityDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly integrityDetailsService: IntegrityDetailsService,
  ) {}

  details: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.INTEGRITY_ORDER_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const orderDetails = await this.integrityDetailsService.getOrderDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    res.render('pages/integrity/details', {
      legacySubjectId,
      backUrl: `/integrity/${legacySubjectId}`,
      details: orderDetails,
    })
  }

  searchResults: RequestHandler = async (req: Request, res: Response, next) => {
    await this.auditService.logPageView(Page.SEARCH_RESULTS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const queryExecutionId = req.query.search_id as string

    if (!queryExecutionId) {
      res.redirect(paths.SEARCH)
      return
    }

    try {
      const orders = await this.integrityDetailsService.getSearchResults({
        userToken: res.locals.user.token,
        queryExecutionId,
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
