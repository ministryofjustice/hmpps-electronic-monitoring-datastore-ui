import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { TimelineCard, TimelineItem } from '../../models/view-models/timelineItems'
import { IntegrityServiceDetails } from '../../data/models/integrityServiceDetails'

const mojFilters = allMojFilters()

export default function integrityServiceHistoryRouter(services: Services): Router {
  const router = Router()

  const toEventSummary = (event: IntegrityServiceDetails): TimelineCard => {
    const { serviceStartDate, serviceEndDate } = event

    return {
      title: 'Service',
      properties: [
        { label: 'Service ID', value: `${event.serviceId}` },
        { label: 'Service start date', value: serviceStartDate ? mojFilters.mojDate(serviceStartDate, 'date') : '' },
        { label: 'Service end date', value: serviceEndDate ? mojFilters.mojDate(serviceEndDate, 'date') : '' },
        {
          label: 'Service address',
          value: [
            `${event.serviceAddress1}`,
            `${event.serviceAddress2}`,
            `${event.serviceAddress3}`,
            `${event.serviceAddressPostCode}`,
          ]
            .filter(line => line && line !== '')
            .join('<br/>\n'),
        },
      ],
    }
  }

  const toCurfewSummary = (event: IntegrityServiceDetails): TimelineCard => {
    const { curfewStartDate, curfewEndDate } = event
    const curfewSchedule = `${curfewStartDate ? mojFilters.mojDate(curfewStartDate, 'date') : ''} - ${curfewEndDate ? mojFilters.mojDate(curfewEndDate, 'date') : ''}`

    return {
      title: 'Curfew schedule',
      properties: [
        { label: 'Monday', value: event.monday === 1 ? curfewSchedule : '' },
        { label: 'Tuesday', value: event.tuesday === 1 ? curfewSchedule : '' },
        { label: 'Wednesday', value: event.wednesday === 1 ? curfewSchedule : '' },
        { label: 'Thursday', value: event.thursday === 1 ? curfewSchedule : '' },
        { label: 'Friday', value: event.friday === 1 ? curfewSchedule : '' },
        { label: 'Saturday', value: event.saturday === 1 ? curfewSchedule : '' },
        { label: 'Sunday', value: event.sunday === 1 ? curfewSchedule : '' },
      ],
    }
  }

  const fromServiceDetails = (serviceDetails: IntegrityServiceDetails[]): TimelineItem[] => {
    return (serviceDetails || []).map(event => {
      return {
        label: 'Service',
        dateTime: event.serviceStartDate,
        cards: [toEventSummary(event), toCurfewSummary(event)],
      } as TimelineItem
    })
  }

  router.get(
    paths.INTEGRITY.SERVICE_HISTORY,
    auditPageViewRequest({ services, page: Page.INTEGRITY_SERVICE_HISTORY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const serviceDetails = await services.integrityServiceDetailsService.getServiceDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const backUrl = buildUrl(paths.INTEGRITY.SUMMARY, { legacySubjectId })
      const timeline = fromServiceDetails(serviceDetails)

      res.render('pages/integrity/service-history', {
        legacySubjectId,
        timeline: timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
        backUrl,
      })
    },
  )

  return router
}
