import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, DatastoreSearchService } from '../services'

import strings from '../constants/strings'
import SearchForOrdersViewModel from '../models/view-models/searchForOrders'
import SearchOrderFormDataModel, { SearchOrderFormData } from '../models/form-data/searchOrder'
import { Order } from '../interfaces/order'
import tabulateOrders from '../utils/tabulateOrders'

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

  searchResultsPage: RequestHandler = async (req: Request, res: Response) => {
    try {
      const formDataA: SearchOrderFormData = SearchOrderFormDataModel.parse(req.body)
    } catch (error) {
      const x = 1
    }

    const formData: SearchOrderFormData = SearchOrderFormDataModel.parse(req.body)

    const results = await this.datastoreSearchService.search({
      userToken: res.locals.user.token,
      data: formData,
    })

    // Check if results is ValidationResult (indicates form input errors)
    if (Array.isArray(results) && results.some(result => 'field' in result && 'error' in result)) {
      req.session.formData = formData
      req.session.validationErrors = results
      res.redirect('search')
      return
    }

    // Clear session data after it's been used
    req.session.validationErrors = undefined
    req.session.formData = undefined

    // If results is Order[], proceed to results view
    res.render('pages/searchResults', { data: tabulateOrders(results as Order[]) })
  }
}
