import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { TimelineCard, TimelineCardProperty, TimelineItem } from '../../models/view-models/timelineItems'
import { IntegrityServiceDetails } from '../../data/models/integrityServiceDetails'

const mojFilters = allMojFilters()

export default function integrityServiceHistoryRouter(services: Services): Router {
  const router = Router()

  const toEventSummary = (event: IntegrityServiceDetails): TimelineCard => {
    const properties: TimelineCardProperty[] = []
    for (const [label, value] of Object.entries(event)) {
      properties.push({ label, value: `${value}` })
    }

    return {
      title: 'Service',
      properties: [
        { label: 'Service ID', value: `${event.serviceId}` },
        { label: 'Service start date', value: mojFilters.mojDate(event.serviceStartDate, 'date') },
        { label: 'Service end date', value: mojFilters.mojDate(event.serviceEndDate, 'date') },
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
    return {
      title: 'Curfew schedule',
      properties: [
        { label: 'Curfew Start Date', value: mojFilters.mojDate(event.curfewStartDate, 'date') },
        { label: 'Curfew End Date', value: mojFilters.mojDate(event.curfewEndDate, 'date') },

        { label: 'Monday', value: `${event.monday}` },
        { label: 'Tuesday', value: `${event.tuesday}` },
        { label: 'Wednesday', value: `${event.wednesday}` },
        { label: 'Thursday', value: `${event.thursday}` },
        { label: 'Friday', value: `${event.friday}` },
        { label: 'Saturday', value: `${event.saturday}` },
        { label: 'Sunday', value: `${event.sunday}` },
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
