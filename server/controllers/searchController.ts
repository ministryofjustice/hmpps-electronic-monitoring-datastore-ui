import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, DatastoreSearchService } from '../services'
import { Order } from '../interfaces/order'

import tabulateOrders from '../utils/tabulateOrders'
import strings from '../constants/strings'

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

    // TODO: errors and formData should be part of session or flash
    const errors: unknown = []
    const formData = {
      'dob-day': '10',
      'dob-month': '02',
      'dob-year': '2024',
    }
    res.locals = {
      ...res.locals,
      page: {
        title: strings.pageHeadings.searchOrderForm,
      },
      errors,
      formData,
    }
    // TODO: Check for validation errors
    /**
     * - check for validation errors
     * - pass form values to form
     */
    res.render('pages/search')
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const formData: Order = {
      dataType: 'am',
      legacySubjectId: 1,
    }

    // TODO: parse formData should be a model that can be parsed using zod ...
    // There should be a schema for the searchOrderForm
    // ++ add a model for date range
    // ++ Add validator for dates

    const results: Order[] = await this.datastoreSearchService.searchForOrders(formData)
    res.render('pages/searchResults', { data: tabulateOrders(results) })
  }
}
