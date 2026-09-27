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
  const properties: TimelineCardProperty[] = []

  if (event.visitType) {
    properties.push({ label: 'Visit Type', value: event.visitType })
  }

  if (event.address) {
    properties.push({
      label: 'Address',
      value: [
        event.address.addressLine1,
        event.address.addressLine2,
        event.address.addressLine3,
        event.address.addressLine4,
        event.address.postcode,
      ]
        .filter(line => line && line.trim() !== '')
        .join(', '),
    })
  }

  if (event.actualWorkStartDateTime) {
    properties.push({
      label: 'Actual work start date',
      value: mojFilters.mojDate(event.actualWorkStartDateTime, 'date'),
    })
    properties.push({
      label: 'Actual work start time',
      value: mojFilters.mojDate(event.actualWorkStartDateTime, 'time'),
    })
  }

  if (event.actualWorkEndDateTime) {
    properties.push({
      label: 'Actual work end date',
      value: mojFilters.mojDate(event.actualWorkEndDateTime, 'date'),
    })
    properties.push({
      label: 'Actual work end time',
      value: mojFilters.mojDate(event.actualWorkEndDateTime, 'time'),
    })
  }

  if (event.visitOutcome) {
    properties.push({ label: 'Visit Outcome', value: event.visitOutcome })
  }

  if (event.visitNotes) {
    properties.push({ label: 'Visit Notes', value: event.visitNotes })
  }

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
