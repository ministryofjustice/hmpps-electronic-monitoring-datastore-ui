import type { Request, RequestHandler, Response } from 'express'
import { ZodError } from 'zod'
import { Page } from '../services/auditService'
import { AuditService, DatastoreSearchService } from '../services'

import strings from '../constants/strings'
import SearchForOrdersViewModel from '../models/view-models/searchForOrders'
import SearchOrderFormDataModel, { SearchOrderFormData } from '../models/form-data/searchOrder'
import { Order } from '../interfaces/order'
import tabulateOrders from '../utils/tabulateOrders'
import { ValidationResult } from '../models/Validation'
import { SearchFormInput } from '../types/SearchFormInput'
import { DateValidationResponse, DateValidator } from '../utils/validators/dateValidator'
import Validator from '../utils/validators/formFieldValidator'

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
    await this.auditService.logPageView(Page.SEARCH_RESULTS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })
    const formData: SearchOrderFormData = SearchOrderFormDataModel.parse(req.body)
    try {
    } catch (zodError) {
      req.session.formData = []
      req.session.validationErrors = [
        {
          field: zodError.path.toString(),
          error: zodError.message,
        },
      ]
      res.redirect('search')
    }

    // Validate input
    const validationErrors: ValidationResult = this.datastoreSearchService.validateInput({
      userToken: res.locals.user.token,
      data: formData,
    })

    // If input validation fails, redirect to search view with errors
    if (validationErrors.length > 0) {
      req.session.formData = formData
      req.session.validationErrors = validationErrors
      res.redirect('search')
    } else {
      // If input validation succeeds, execute the search
      const results = await this.datastoreSearchService.search({
        userToken: res.locals.user.token,
        data: formData,
      })

      // Clear session data after it's been used
      req.session.validationErrors = undefined
      req.session.formData = undefined

      // Proceed to results view
      res.render('pages/searchResults', { data: tabulateOrders(results as Order[]) })
    }
  }
}
