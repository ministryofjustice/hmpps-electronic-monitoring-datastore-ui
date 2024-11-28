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

    const errors = JSON.parse(req.flash('validationErrors')?.[0] || '[]')
    const formData = JSON.parse(req.flash('formData')?.[0] || '[{}]')

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
      req.flash('formData', JSON.stringify(formData))
      req.flash('validationErrors', JSON.stringify(results))
      res.redirect('search')
      return
    }

    // If results is Order[], proceed to results view
    res.render('pages/searchResults', { data: tabulateOrders(results as Order[]) })
  }
}
