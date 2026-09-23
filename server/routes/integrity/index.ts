import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'

import { IntegritySearchResultView } from '../../models/view-models/integritySearchResults'
import { IntegrityOrderSummaryView } from '../../models/view-models/integrityOrderSummary'
import { IntegrityOrderDetailsView } from '../../models/view-models/integrityOrderDetails'
import { IntegrityEquipmentDetailsView } from '../../models/view-models/integrityEquipmentDetails'
import { IntegrityEventHistoryView } from '../../models/view-models/integrityEventHistory'
import { IntegrityServiceDetailsView } from '../../models/view-models/integrityServiceDetails'
import { IntegritySuspensionOfVisitsView } from '../../models/view-models/integritySuspensionOfVisits'
import { IntegrityVisitDetailsView } from '../../models/view-models/integrityVisitDetails'

export default function integrityRouter(services: Services): Router {
  const router = Router()

  // integrity
  router.get(
    paths.INTEGRITY_ORDER.INDEX,
    auditPageViewRequest({ services, page: Page.SEARCH_RESULTS }),
    async (req: Request, res: Response, next) => {
      const { search_id: queryExecutionId } = req.query as { search_id: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      if (!queryExecutionId) {
        res.redirect(paths.SEARCH)
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
          res.redirect(paths.SEARCH)
          return
        }

        next(error)
      }

      const viewModel = IntegritySearchResultView.construct(orders)
      res.render('pages/search-results', { viewModel, orderType: 'integrity' })
    },
  )

  router.get(
    paths.INTEGRITY_ORDER.SUMMARY,
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
    paths.INTEGRITY_ORDER.DETAILS,
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

  router.get(
    paths.INTEGRITY_ORDER.VISIT_DETAILS,
    auditPageViewRequest({ services, page: Page.INTEGRITY_VISIT_DETAILS }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const visitDetails = await services.integrityVisitDetailsService.getVisitDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const backUrl = buildUrl(paths.INTEGRITY_ORDER.SUMMARY, { legacySubjectId })

      const viewModel = IntegrityVisitDetailsView.construct(legacySubjectId, backUrl, visitDetails)
      res.render('pages/integrity/visit-details', viewModel)
    },
  )

  router.get(
    paths.INTEGRITY_ORDER.EQUIPMENT_DETAILS,
    auditPageViewRequest({ services, page: Page.INTEGRITY_EQUIPMENT_DETAILS }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const equipmentDetails = await services.integrityEquipmentDetailsService.getEquipmentDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const backUrl = buildUrl(paths.INTEGRITY_ORDER.SUMMARY, { legacySubjectId })

      const viewModel = IntegrityEquipmentDetailsView.construct(legacySubjectId, backUrl, equipmentDetails)
      res.render('pages/integrity/equipment-details', viewModel)
    },
  )

  router.get(
    paths.INTEGRITY_ORDER.SERVICE_DETAILS,
    auditPageViewRequest({ services, page: Page.INTEGRITY_SERVICE_DETAILS }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const serviceDetails = await services.integrityServiceDetailsService.getServiceDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const backUrl = buildUrl(paths.INTEGRITY_ORDER.SUMMARY, { legacySubjectId })

      const viewModel = IntegrityServiceDetailsView.construct(legacySubjectId, backUrl, serviceDetails)
      res.render('pages/integrity/service-details', viewModel)
    },
  )

  router.get(
    paths.INTEGRITY_ORDER.EVENT_HISTORY,
    auditPageViewRequest({ services, page: Page.INTEGRITY_EVENT_HISTORY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const eventHistory = await services.integrityEventHistoryService.getEventHistory({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const backUrl = buildUrl(paths.INTEGRITY_ORDER.SUMMARY, { legacySubjectId })

      const viewModel = IntegrityEventHistoryView.construct(legacySubjectId, backUrl, eventHistory)
      res.render('pages/integrity/event-history', viewModel)
    },
  )

  router.get(
    paths.INTEGRITY_ORDER.SUSPENSION_OF_VISITS,
    auditPageViewRequest({ services, page: Page.INTEGRITY_SUSPENSION_OF_VISITS }),
    async (req: Request, res: Response) => {
      const legacySubjectId = req.params.legacySubjectId as string
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const suspensionOfVisitsData = await services.integritySuspensionOfVisitsService.getSuspensionOfVisits({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const backUrl = buildUrl(paths.INTEGRITY_ORDER.SUMMARY, { legacySubjectId })

      const viewModel = IntegritySuspensionOfVisitsView.construct(
        legacySubjectId,
        backUrl,
        suspensionOfVisitsData || [],
      )
      res.render('pages/integrity/suspension-of-visits', viewModel)
    },
  )

  return router
}
