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

    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
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
    // const formData = SearchOrderFormDataModel.parse(req.body)
    const formData: Order = {
      dataType: 'am',
      legacySubjectId: 1,
    }
    const results: Order[] = await this.datastoreSearchService.searchForOrders(formData)

    // const results: Order[] = await this.datastoreSearchService.searchForOrders(formData)
    res.render('pages/searchResults', { data: tabulateOrders(results) })
  }
}
