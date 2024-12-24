import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, DatastoreSearchService } from '../services'

import strings from '../constants/strings'
import SearchForOrdersViewModel from '../models/view-models/searchForOrders'
import SearchOrderFormDataModel from '../models/form-data/searchOrder'
import { Order } from '../interfaces/order'
import tabulateOrders from '../utils/tabulateOrders'

export default class SearchController {
  constructor(
    private readonly auditService: AuditService,
    private readonly datastoreSearchService: DatastoreSearchService,
  ) {}

  search: RequestHandler = async (req: Request, res: Response) => {
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

  view: RequestHandler = async (req: Request, res: Response) => {
    const formData = SearchOrderFormDataModel.parse(req.body)

    const results = await this.datastoreSearchService.search({
      userToken: res.locals.user.token,
      data: formData,
    })

    // Check if results is ValidationResult (indicates form input errors)
    if (Array.isArray(results) && results.some(result => 'field' in result && 'error' in result)) {
      // TODO: Consider rendering search form with validation errors here
      // TODO: *** IF it is decided NOT to use sessions ***
      // e.g. comment out
      // req.session.formData = formData
      // req.session.validationErrors = results
      // and have
      // const viewModel = SearchForOrdersViewModel.construct(formData as never, errors as never)
      // res.render('pages/search', viewModel)
      // finally remove line 60 (redirect)

      req.session.formData = formData
      req.session.validationErrors = results

      res.redirect('search')
      return
    }

    // Clear session data as it is no longer required
    req.session.validationErrors = undefined
    req.session.formData = undefined

    await this.auditService.logPageView(Page.SEARCH_RESULTS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    // If results is Order[], proceed to results view
    if (results.length > 0) {
      res.render('pages/searchResults', { data: tabulateOrders(results as Order[]) })
    } else {
      res.render('pages/noResults')
    }
  }
}
