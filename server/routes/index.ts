import { Request, Response, NextFunction, Router } from 'express'

import { Page } from '../constants/pages'
import { paths } from '../constants/paths'
import { strings } from '../constants/strings'
import auditPageViewRequest from '../middleware/auditPageViewRequest'
import auditSearchRequest from '../middleware/auditSearchRequest'

import type { Services } from '../services'

import integrityRouter from './integrity'
import alcoholMonitoringRouter from './alcoholMonitoring'

import { OrderSearchCriteria } from '../models/requests/OrderSearchRequest'
import { convertZodErrorToValidationError, OrderSearchView } from '../models/view-models/orderSearch'

export default function routes(services: Services): Router {
  const router = Router()

  router.get(
    paths.START,
    auditPageViewRequest({ services, page: Page.START }),
    async (_req: Request, res: Response, _next: NextFunction) => {
      res.render('pages/index')
    },
  )

  router.get(
    paths.API_CONNECTION_TEST,
    auditPageViewRequest({ services, page: Page.API_CONNECTION_TEST }),
    async (_req: Request, res: Response, _next: NextFunction) => {
      const { token } = res.locals.user
      const apiResult = await services.emDatastoreConnectionService.test(token)

      const viewModel = { data: apiResult }
      res.render('pages/apiTest', viewModel)
    },
  )

  router.get(
    paths.SEARCH,
    auditPageViewRequest({ services, page: Page.SEARCH }),
    async (req: Request, res: Response, _next: NextFunction) => {
      const validationErrors = (req.flash('validationErrors') || []).map(validationError => JSON.parse(validationError))
      const formData = (req.flash('formData') || []).map(data => JSON.parse(data))[0] || {}

      const viewModel = OrderSearchView.construct(formData, validationErrors)

      res.locals = {
        ...res.locals,
        page: {
          title: strings.pageHeadings.searchOrderForm,
        },
      }

      res.render('pages/search', viewModel)
    },
  )

  router.post(
    paths.SEARCH,
    auditSearchRequest({ services, page: Page.SEARCH }),
    async (req: Request, res: Response) => {
      const { token } = res.locals.user
      const { searchType } = req.body
      const { data, error, success } = OrderSearchCriteria.safeParse(req.body)

      if (!success) {
        const errors = convertZodErrorToValidationError(error)

        req.flash('formData', JSON.stringify(req.body))
        errors.map(validationError => req.flash('validationErrors', JSON.stringify(validationError)))

        res.redirect(paths.SEARCH)
        return
      }

      const queryExecutionResponse = await services.emDatastoreOrderSearchService.submitSearchQuery(
        searchType,
        data,
        token,
      )

      const redirectUrl =
        searchType === 'alcohol-monitoring' ? paths.ALCOHOL_MONITORING.INDEX : paths.INTEGRITY_ORDER.INDEX
      res.redirect(`${redirectUrl}?search_id=${encodeURIComponent(queryExecutionResponse.queryExecutionId)}`)
    },
  )

  router.use(integrityRouter(services))
  router.use(alcoholMonitoringRouter(services))

  return router
}
