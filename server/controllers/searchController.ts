import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, DatastoreSearchService } from '../services'
import strings from '../constants/strings'
import SearchForOrdersViewModel from '../models/view-models/searchForOrders'
import SearchOrderFormDataModel, { SearchOrderFormData } from '../models/form-data/searchOrder'
import { Order } from '../interfaces/order'
import tabulateOrders from '../utils/tabulateOrders'
import { ValidationResult } from '../models/Validation'

export default class SearchController {
  constructor(
    private readonly auditService: AuditService,
    private readonly datastoreSearchService: DatastoreSearchService,
  ) {}

  searchPage: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.SEARCH_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const errors = req.session.validationErrors || []
    const formData = req.session.formData || {}

    //
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

    const validatedFormData: SearchOrderFormData = SearchOrderFormDataModel.parse(req.body)

    // Validate input
    const validationErrors: ValidationResult = this.datastoreSearchService.validateInput({
      userToken: res.locals.user.token,
      data: validatedFormData,
    })

    // If input validation fails, redirect to search view with errors
    if (validationErrors.length > 0) {
      req.session.formData = validatedFormData
      req.session.validationErrors = validationErrors
      res.redirect('search')
    } else {
      // If input validation succeeds, execute the search
      const queryExecutionId = await this.datastoreSearchService.submitSearchQuery({
        userToken: res.locals.user.token,
        data: validatedFormData,
      })

      // Clear session data as it is no longer required
      req.session.validationErrors = undefined
      req.session.formData = undefined

      // Redirect to results page
      res.redirect(`search/results?search_id=${encodeURIComponent(queryExecutionId)}`)
    }
  }

  searchResultsPage: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.SEARCH_RESULTS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    // Get orders by queryExecutionId
    const orders = await this.datastoreSearchService.getSearchResults({
      userToken: res.locals.user.token,
      queryExecutionId: req.query.search_id as string,
    })

    // If results is Order[], proceed to results view
    if (orders.length > 0) {
      res.render('pages/searchResults', { data: tabulateOrders(orders as Order[]) })
    } else {
      res.render('pages/noResults')
    }
  }
}
