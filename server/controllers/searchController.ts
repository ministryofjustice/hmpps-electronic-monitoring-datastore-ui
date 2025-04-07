import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, EmDatastoreOrderSearchService } from '../services'
import strings from '../constants/strings'
import paths from '../constants/paths'
import SearchForOrdersViewModel from '../models/view-models/searchForOrders'
import SearchResultsViewModel from '../models/view-models/searchResults'
import { ParsedSearchFormDataModel } from '../models/form-data/searchOrder'
import { Order } from '../interfaces/order'
import { ValidationResult } from '../models/Validation'

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

    const errors = req.session.validationErrors || []
    const formData = req.session.formData || {}

    const viewModel = SearchForOrdersViewModel.construct(formData as never, errors as never)

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

    const validatedFormData = ParsedSearchFormDataModel.parse(req.body)

    const validationErrors: ValidationResult = this.datastoreSearchService.validateInput({
      userToken: res.locals.user.token,
      data: validatedFormData,
    })

    if (validationErrors.length > 0) {
      req.session.formData = validatedFormData
      req.session.validationErrors = validationErrors
      res.redirect(paths.SEARCH)
    } else {
      const queryExecutionResponse = await this.datastoreSearchService.submitSearchQuery({
        userToken: res.locals.user.token,
        data: validatedFormData,
      })

      req.session.validationErrors = undefined
      req.session.formData = undefined

      const redirectUrl =
        req.body.searchType === 'integrity'
          ? paths.INTEGRITY_ORDER.SEARCH_RESULTS
          : paths.ALCOHOL_MONITORING.SEARCH_RESULTS
      res.redirect(`${redirectUrl}?search_id=${encodeURIComponent(queryExecutionResponse.queryExecutionId)}`)
    }
  }

  searchResultsPage: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.SEARCH_RESULTS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { orderType } = req.params
    const queryExecutionId = req.query.search_id as string

    if (!queryExecutionId) {
      res.redirect(paths.SEARCH)
      return
    }

    let orders: Order[]

    try {
      orders = await this.datastoreSearchService.getSearchResults({
        userToken: res.locals.user.token,
        queryExecutionId,
      })
    } catch (error) {
      if (error.message === 'Error retrieving search results: Invalid query execution ID') {
        res.redirect(paths.SEARCH)
        return
      }
      throw error
    }

    const viewModel = SearchResultsViewModel.construct(orders)

    res.render('pages/searchResults', { viewModel, orderType })
  }
}
