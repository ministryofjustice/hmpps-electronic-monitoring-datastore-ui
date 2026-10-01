import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'

import { OrderSearchResultsView } from '../../models/view-models/orderSearchResults'
import { AlcoholMonitoringOrderSummaryView } from '../../models/view-models/alcoholMonitoringOrderSummary'
import { AlcoholMonitoringOrderDetailsView } from '../../models/view-models/alcoholMonitoringOrderDetails'

import alcoholMonitoringEventsHistoryRouter from './event-history'
import alcoholMonitoringVisitsHistoryRouter from './visits-history'
import alcoholMonitoringServiceHistoryRouter from './service-history'
import alcoholMonitoringEquipmentHistoryRouter from './equipment-history'

export default function alcoholMonitoringRouter(services: Services): Router {
  const router = Router()

  router.get(
    paths.ALCOHOL_MONITORING.ORDERS,
    auditPageViewRequest({ services, page: Page.ORDER_SEARCH_RESULTS }),
    async (req: Request, res: Response, next) => {
      const { search_id: queryExecutionId } = req.query as { search_id: string }

      if (!queryExecutionId) {
        res.redirect(paths.SEARCH_ORDERS)
        return
      }

      let orders = [] as AlcoholMonitoringOrderDetails[]
      try {
        orders = await services.alcoholMonitoringOrderDetailsService.getSearchResults({
          userToken: res.locals.user.token,
          queryExecutionId,
        })
      } catch (error) {
        const e = error as { message: string }
        if (e.message === 'Error retrieving search results: Invalid query execution ID') {
          res.redirect(paths.SEARCH_ORDERS)
          return
        }

        next(error)
      }

      res.render('pages/search-results', {
        orders: OrderSearchResultsView.fromAlcoholMonitoringOrder(orders),
        orderType: 'alcohol-monitoring',
        orderDescription: 'Alcohol monitoring',
      })
    },
  )

  router.get(
    paths.ALCOHOL_MONITORING.SUMMARY,
    auditPageViewRequest({ services, page: Page.ALCOHOL_MONITORING_ORDER_SUMMARY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }

      const orderDetails = await services.alcoholMonitoringOrderDetailsService.getOrderDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
      })

      const viewModel = AlcoholMonitoringOrderSummaryView.construct(legacySubjectId, orderDetails)
      res.render('pages/alcohol-monitoring/order-summary', viewModel)
    },
  )

  router.get(
    paths.ALCOHOL_MONITORING.DETAILS,
    auditPageViewRequest({ services, page: Page.ALCOHOL_MONITORING_ORDER_DETAILS }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }

      const orderDetails = await services.alcoholMonitoringOrderDetailsService.getOrderDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
      })

      const viewModel = AlcoholMonitoringOrderDetailsView.construct(legacySubjectId, orderDetails)
      res.render('pages/alcohol-monitoring/order-details', viewModel)
    },
  )

  router.use(alcoholMonitoringEquipmentHistoryRouter(services))
  router.use(alcoholMonitoringEventsHistoryRouter(services))
  router.use(alcoholMonitoringServiceHistoryRouter(services))
  router.use(alcoholMonitoringVisitsHistoryRouter(services))

  return router
}
