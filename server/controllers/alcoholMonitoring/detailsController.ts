import type { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { Page } from '../../services/auditService'
import { AuditService, AlcoholMonitoringOrderDetailsService } from '../../services'
import { AlcoholMonitoringOrderDetailsView } from '../../models/view-models/alcoholMonitoringOrderDetails'
import { AlchoholMonitoringSearchResultView } from '../../models/view-models/alcoholMonitoringSearchResults'

export default class OrderDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly alcoholMonitoringDetailsService: AlcoholMonitoringOrderDetailsService,
  ) {}

  details: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.AM_ORDER_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const orderDetails = await this.alcoholMonitoringDetailsService.getOrderDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    const viewModel = AlcoholMonitoringOrderDetailsView.construct(legacySubjectId, orderDetails)

    res.render('pages/alcohol-monitoring/details', viewModel)
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
      const orders = await this.alcoholMonitoringDetailsService.getSearchResults({
        userToken: res.locals.user.token,
        queryExecutionId,
      })

      const viewModel = AlchoholMonitoringSearchResultView.construct(orders)

      res.render('pages/searchResults', { viewModel, orderType: 'alcohol-monitoring' })
    } catch (error) {
      if (error.message === 'Error retrieving search results: Invalid query execution ID') {
        res.redirect(paths.SEARCH)
        return
      }

      next(error)
    }
  }
}
