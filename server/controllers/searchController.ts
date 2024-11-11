import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, DatastoreSearchService } from '../services'
import { Order } from '../interfaces/order'

import tabluateOrders from '../utils/tabulateOrders'

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

    res.render('pages/search')
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const formData: Order = {
      dataType: 'am',
      legacySubjectId: 1,
    }
    const results: Order[] = await this.datastoreSearchService.searchForOrders(formData)
    res.render('pages/searchResults', { data: tabluateOrders(results) })
  }
}
