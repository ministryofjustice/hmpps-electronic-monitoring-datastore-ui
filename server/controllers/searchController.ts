import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, EmDatastoreOrderSearchService } from '../services'
import strings from '../constants/strings'
import paths from '../constants/paths'
import { OrderSearchView } from '../models/view-models/orderSearch'
import { OrderSearchCriteria } from '../models/requests/SearchOrdersRequest'
import { FormError } from '../@types/express'

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

    const errors = req.session.validationErrors
    const formData = req.session.formData || {}

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

    let redirectUrl = paths.SEARCH

    const result = OrderSearchCriteria.safeParse(req.body)

    if (!result.success) {
      req.session.formData = req.body
      req.session.validationErrors = result.error?.issues?.map(
        issue =>
          ({
            field: issue.path.join('.'),
            message: issue.message,
          }) as FormError,
      )
    } else {
      const queryExecutionResponse = await this.datastoreSearchService.submitSearchQuery({
        userToken: res.locals.user.token,
        data: result.data,
      })

      req.session.formData = undefined
      req.session.validationErrors = undefined

      redirectUrl = req.body.searchType === 'integrity' ? paths.INTEGRITY_ORDER.INDEX : paths.ALCOHOL_MONITORING.INDEX
      redirectUrl = `${redirectUrl}?search_id=${encodeURIComponent(queryExecutionResponse.queryExecutionId)}`
    }

    res.redirect(redirectUrl)
  }
}
