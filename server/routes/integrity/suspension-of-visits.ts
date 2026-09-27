import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { TimelineCard, TimelineCardProperty, TimelineItem } from '../../models/view-models/timelineItems'
import { IntegritySuspensionOfVisits } from '../../data/models/integritySuspensionOfVisits'

const mojFilters = allMojFilters()

export default function integritySuspensionOfVisitsRouter(services: Services): Router {
  const router = Router()

  const suspensionOfVisitsToTimelineCard = (event: IntegritySuspensionOfVisits): TimelineCard => {
    const properties: TimelineCardProperty[] = []
    if (event.requestedDate) {
      properties.push({
        label: 'Requested Date',
        value: mojFilters.mojDate(event.requestedDate, 'date'),
      })
    }

    if (event.startDate) {
      properties.push({
        label: 'Start Date',
        value: mojFilters.mojDate(event.startDate, 'date'),
      })
    }
    if (event.startTime) {
      properties.push({
        label: 'Start Time',
        value: mojFilters.mojDate(event.startTime, 'time'),
      })
    }

    if (event.endDate) {
      properties.push({
        label: 'End Date',
        value: mojFilters.mojDate(event.endDate, 'date'),
      })
    }

    if (event.suspensionOfVisits) {
      properties.push({
        label: 'Suspension of Visits',
        value: event.suspensionOfVisits,
      })
    }

    return {
      title: 'Suspension of visits',
      properties,
    }
  }

  const fromSuspensionOfVisits = (suspensionOfVisits: IntegritySuspensionOfVisits[]): TimelineItem[] => {
    return (suspensionOfVisits || []).map(event => {
      return {
        label: 'Suspension of visits',
        dateTime: `${event.startDate}T${event.startTime}Z`,
        cards: [suspensionOfVisitsToTimelineCard(event)],
      } as TimelineItem
    })
  }

  router.get(
    paths.INTEGRITY.SUSPENSION_OF_VISITS_HISTORY,
    auditPageViewRequest({ services, page: Page.INTEGRITY_SUSPENSION_OF_VISITS }),
    async (req: Request, res: Response) => {
      const legacySubjectId = req.params.legacySubjectId as string
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const suspensionOfVisitsData = await services.integritySuspensionOfVisitsService.getSuspensionOfVisits({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const backUrl = buildUrl(paths.INTEGRITY.SUMMARY, { legacySubjectId })
      const timeline = fromSuspensionOfVisits(suspensionOfVisitsData)

      res.render('pages/integrity/suspension-of-visits', {
        legacySubjectId,
        timeline: timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
        backUrl,
      })
    },
  )

  return router
}
