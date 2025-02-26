import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, SearchService } from '../services'
import strings from '../constants/strings'
import SearchForOrdersViewModel from '../models/view-models/searchForOrders'
import SearchOrderFormDataModel, { SearchOrderFormData } from '../models/form-data/searchOrder'
import { Order } from '../interfaces/order'
import tabulateOrders from '../utils/tabulateOrders'
import { ValidationResult } from '../models/Validation'

export default class SearchController {
  constructor(
    private readonly auditService: AuditService,
    private readonly searchService: SearchService,
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

    const validatedFormData: SearchOrderFormData = SearchOrderFormDataModel.parse(req.body)

    const validationErrors: ValidationResult = this.searchService.validateInput({
      userToken: res.locals.user.token,
      data: validatedFormData,
    })

    if (validationErrors.length > 0) {
      req.session.formData = validatedFormData
      req.session.validationErrors = validationErrors
      res.redirect('search')
    } else {
      const queryExecutionResponse = await this.searchService.submitSearchQuery({
        userToken: res.locals.user.token,
        data: validatedFormData,
      })

      req.session.validationErrors = undefined
      req.session.formData = undefined

      // Redirect to results page
      res.redirect(`search/orders?search_id=${encodeURIComponent(queryExecutionResponse.queryExecutionId)}`)
    }
  }

  searchResultsPage: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.SEARCH_RESULTS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const queryExecutionId = req.query.search_id as string

    if (!queryExecutionId) {
      res.redirect('/search')
      return
    }

    let orders: Order[]

    try {
      orders = await this.searchService.getSearchResults({
        userToken: res.locals.user.token,
        queryExecutionId,
      })
    } catch (error) {
      if (error.message === 'Error retrieving search results: Invalid query execution ID') {
        res.redirect('/search')
        return
      }
      throw error
    }

    res.render('pages/searchResults', { data: tabulateOrders(orders as Order[]) })
  }
}
