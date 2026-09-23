import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'
import { AlchoholMonitoringSearchResultView } from '../../models/view-models/alcoholMonitoringSearchResults'
import { AlcoholMonitoringOrderSummaryView } from '../../models/view-models/alcoholMonitoringOrderSummary'
import { AlcoholMonitoringOrderDetailsView } from '../../models/view-models/alcoholMonitoringOrderDetails'
import { AlcoholMonitoringEquipmentDetailsView } from '../../models/view-models/alcoholMonitoringEquipmentDetails'
import { AlcoholMonitoringEventHistoryView } from '../../models/view-models/alcoholMonitoringEventHistory'
import { AlcoholMonitoringServiceDetailsView } from '../../models/view-models/alcoholMonitoringServiceDetails'
import { AlcoholMonitoringVisitDetailsView } from '../../models/view-models/alcoholMonitoringVisitDetails'

export default function alcoholMonitoringRouter(services: Services): Router {
  const router = Router()

  router.get(
    paths.ALCOHOL_MONITORING.INDEX,
    auditPageViewRequest({ services, page: Page.SEARCH_RESULTS }),
    async (req: Request, res: Response, next) => {
      const { search_id: queryExecutionId } = req.query as { search_id: string }

      if (!queryExecutionId) {
        res.redirect(paths.SEARCH)
        return
      }

      try {
        const orders = await services.alcoholMonitoringOrderDetailsService.getSearchResults({
          userToken: res.locals.user.token,
          queryExecutionId,
        })

        const viewModel = AlchoholMonitoringSearchResultView.construct(orders)
        res.render('pages/search-results', { viewModel, orderType: 'alcohol-monitoring' })
      } catch (error) {
        const e = error as { message: string }
        if (e.message === 'Error retrieving search results: Invalid query execution ID') {
          res.redirect(paths.SEARCH)
          return
        }

        next(error)
      }
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

  router.get(
    paths.ALCOHOL_MONITORING.EQUIPMENT_DETAILS,
    auditPageViewRequest({ services, page: Page.ALCOHOL_MONITORING_EQUIPMENT_DETAILS }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }

      const equipmentDetails = await services.alcoholMonitoringEquipmentDetailsService.getEquipmentDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
      })

      const backUrl = buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId })

      const viewModel = AlcoholMonitoringEquipmentDetailsView.construct(legacySubjectId, backUrl, equipmentDetails)
      res.render('pages/alcohol-monitoring/equipment-details', viewModel)
    },
  )

  router.get(
    paths.ALCOHOL_MONITORING.VISIT_DETAILS,
    auditPageViewRequest({ services, page: Page.ALCOHOL_MONITORING_VISIT_DETAILS }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }

      const visitDetails = await services.alcoholMonitoringVisitDetailsService.getVisitDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
      })

      const backUrl = buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId })

      const viewModel = AlcoholMonitoringVisitDetailsView.construct(legacySubjectId, backUrl, visitDetails)
      res.render('pages/alcohol-monitoring/visit-details', viewModel)
    },
  )

  router.get(
    paths.ALCOHOL_MONITORING.SERVICE_DETAILS,
    auditPageViewRequest({ services, page: Page.ALCOHOL_MONITORING_SERVICE_DETAILS }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }

      const serviceDetails = await services.alcoholMonitoringServiceDetailsService.getServiceDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
      })

      const backUrl = buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId })

      const viewModel = AlcoholMonitoringServiceDetailsView.construct(legacySubjectId, backUrl, serviceDetails)
      res.render('pages/alcohol-monitoring/service-details', viewModel)
    },
  )

  router.get(
    paths.ALCOHOL_MONITORING.EVENT_HISTORY,
    auditPageViewRequest({ services, page: Page.ALCOHOL_MONITORING_EVENT_HISTORY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }

      const events = await services.alcoholMonitoringEventHistoryService.getEventHistory({
        userToken: res.locals.user.token,
        legacySubjectId,
      })

      const backUrl = buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId })

      const viewModel = AlcoholMonitoringEventHistoryView.construct(legacySubjectId, backUrl, events)
      res.render('pages/alcohol-monitoring/event-history', viewModel)
    },
  )

  return router
}
