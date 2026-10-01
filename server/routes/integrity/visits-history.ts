import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { TimelineCard, TimelineCardProperty, TimelineItem } from '../../models/view-models/timelineItems'
import { IntegrityVisitDetails } from '../../data/models/integrityVisitDetails'

const mojFilters = allMojFilters()

const visitDetailsToTimelineCard = (event: IntegrityVisitDetails): TimelineCard => {
  const { actualWorkStartDateTime, actualWorkEndDateTime } = event

  const properties: TimelineCardProperty[] = [
    {
      label: 'Address',
      value: [
        event.address?.addressLine1,
        event.address?.addressLine2,
        event.address?.addressLine3,
        event.address?.addressLine4,
        event.address?.postcode,
      ]
        .filter(line => line && line.trim() !== '')
        .join('<br/>\n'),
    },
    {
      label: 'Actual work start date',
      value: actualWorkStartDateTime ? mojFilters.mojDate(actualWorkStartDateTime, 'date') : '',
    },
    {
      label: 'Actual work start time',
      value: actualWorkStartDateTime ? mojFilters.mojDate(actualWorkStartDateTime, 'time') : '',
    },
    {
      label: 'Actual work end date',
      value: actualWorkEndDateTime ? mojFilters.mojDate(actualWorkEndDateTime, 'date') : '',
    },
    {
      label: 'Actual work end time',
      value: actualWorkEndDateTime ? mojFilters.mojDate(actualWorkEndDateTime, 'time') : '',
    },
    { label: 'Outcome', value: event.visitOutcome },
    { label: 'Notes', value: event.visitNotes },
  ]

  return {
    title: event.visitType || 'Visit',
    properties,
  }
}

export const fromVisitHistory = (visitDetails: IntegrityVisitDetails[]): TimelineItem[] => {
  return (visitDetails || []).map(event => {
    return {
      label: event.visitType,
      dateTime: event.actualWorkStartDateTime,
      cards: [visitDetailsToTimelineCard(event)],
    } as TimelineItem
  })
}

export default function integrityVisitsHistoryRouter(services: Services): Router {
  const router = Router()

  router.get(
    paths.INTEGRITY.VISITS_HISTORY,
    auditPageViewRequest({ services, page: Page.INTEGRITY_VISIT_HISTORY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const visitDetails = await services.integrityVisitDetailsService.getVisitDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const backUrl = buildUrl(paths.INTEGRITY.SUMMARY, { legacySubjectId })
      const timeline = fromVisitHistory(visitDetails)

      res.render('pages/integrity/visits-history', {
        legacySubjectId,
        timeline: timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
        backUrl,
      })
    },
  )

  return router
}
