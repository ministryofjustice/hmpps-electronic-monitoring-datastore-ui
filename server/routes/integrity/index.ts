import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import type { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'

import { OrderSearchResultsView } from '../../models/view-models/orderSearchResults'
import { IntegrityOrderSummaryView } from '../../models/view-models/integrityOrderSummary'
import { IntegrityOrderDetailsView } from '../../models/view-models/integrityOrderDetails'

import integrityEventsHistoryRouter from './event-history'
import integrityVisitsHistoryRouter from './visits-history'
import integrityServiceHistoryRouter from './service-history'
import integrityEquipmentHistoryRouter from './equipment-history'
import integritySuspensionOfVisitsRouter from './suspension-of-visits'

const mojFilters = allMojFilters()

export default function integrityRouter(services: Services): Router {
  const router = Router()

  // integrity
  router.get(
    paths.INTEGRITY.ORDERS,
    auditPageViewRequest({ services, page: Page.ORDER_SEARCH_RESULTS }),
    async (req: Request, res: Response, next) => {
      const { search_id: queryExecutionId } = req.query as { search_id: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      if (!queryExecutionId) {
        res.redirect(paths.SEARCH_ORDERS)
        return
      }

      let orders = [] as IntegrityOrderDetails[]
      try {
        orders = await services.integrityOrderDetailsService.getSearchResults({
          userToken: res.locals.user.token,
          queryExecutionId,
          restricted,
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
        orders: OrderSearchResultsView.fromIntegrityOrder(orders),
        orderType: 'integrity',
        orderDescription: 'Integrity',
      })
    },
  )

  router.get(
    paths.INTEGRITY.SUMMARY,
    auditPageViewRequest({ services, page: Page.INTEGRITY_ORDER_SUMMARY }),
    async (req: Request, res: Response) => {
      const legacySubjectId = req.params.legacySubjectId as string
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const orderDetails = await services.integrityOrderDetailsService.getOrderDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const viewModel = IntegrityOrderSummaryView.construct(legacySubjectId, orderDetails)
      res.render('pages/integrity/order-summary', viewModel)
    },
  )

  router.get(
    paths.INTEGRITY.DETAILS,
    auditPageViewRequest({ services, page: Page.INTEGRITY_ORDER_DETAILS }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const orderDetails = await services.integrityOrderDetailsService.getOrderDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const viewModel = IntegrityOrderDetailsView.construct(legacySubjectId, orderDetails)
      res.render('pages/integrity/order-details', viewModel)
    },
  )

  router.use(integrityEquipmentHistoryRouter(services))
  router.use(integrityEventsHistoryRouter(services))
  router.use(integrityServiceHistoryRouter(services))
  router.use(integritySuspensionOfVisitsRouter(services))
  router.use(integrityVisitsHistoryRouter(services))

  return router
}
