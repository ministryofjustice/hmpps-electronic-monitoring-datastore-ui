import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, EmDatastoreOrderSearchService } from '../services'
import strings from '../constants/strings'
import paths from '../constants/paths'
import { convertZodErrorToValidationError, OrderSearchView } from '../models/view-models/orderSearch'
import { OrderSearchCriteria } from '../models/requests/SearchOrdersRequest'

export default class SearchController {
  constructor(
    private readonly auditService: AuditService,
    private readonly datastoreSearchService: EmDatastoreOrderSearchService,
  ) {}

  searchPage: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.SEARCH_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const errors = req.flash('validationErrors') || []
    const formData = req.flash('formData') || {}

    const viewModel = OrderSearchView.construct(formData as never, errors as never)

    res.locals = {
      ...res.locals,
      page: {
        title: strings.pageHeadings.searchOrderForm,
      },
    }

    res.render('pages/search', viewModel)
  }

  submitSearchQuery: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.SEARCH_RESULTS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const result = OrderSearchCriteria.safeParse(req.body)

    if (!result.success) {
      const errors = convertZodErrorToValidationError(result.error)

      req.flash('formData', req.body)
      req.flash('validationErrors', errors)

      res.redirect(paths.SEARCH)
    } else {
      const queryExecutionResponse = await this.datastoreSearchService.submitSearchQuery({
        userToken: res.locals.user.token,
        data: result.data,
      })

      const redirectUrl =
        req.body.searchType === 'integrity' ? paths.INTEGRITY_ORDER.INDEX : paths.ALCOHOL_MONITORING.INDEX
      res.redirect(`${redirectUrl}?search_id=${encodeURIComponent(queryExecutionResponse.queryExecutionId)}`)
    }
  }
}
