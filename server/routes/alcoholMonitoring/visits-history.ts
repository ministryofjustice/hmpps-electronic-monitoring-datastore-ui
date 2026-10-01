import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { TimelineCard, TimelineCardProperty, TimelineItem } from '../../models/view-models/timelineItems'
import { AlcoholMonitoringVisitDetails } from '../../data/models/alcoholMonitoringVisitDetails'

const mojFilters = allMojFilters()

const visitDetailsToTimelineCard = (event: AlcoholMonitoringVisitDetails): TimelineCard => {
  const { dateVisitRaised, actualWorkStartDateTime, actualWorkEndDateTime } = event

  const properties: TimelineCardProperty[] = [
    { label: 'Visit ID', value: event.visitId || '' },
    { label: 'Visit types', value: event.visitType || '' },
    { label: 'Visit attempt', value: event.visitAttempt || '' },
    { label: 'Date visit raised', value: dateVisitRaised ? mojFilters.mojDate(dateVisitRaised, 'date') : '' },
    { label: 'Visit address', value: event.visitAddress || '' },
    { label: 'Visit notes', value: event.visitNotes || '' },
    { label: 'Visit outcome', value: event.visitOutcome || '' },
    {
      label: 'Actual work start datetime',
      value: actualWorkStartDateTime ? mojFilters.mojDate(actualWorkStartDateTime, 'datetime') : '',
    },
    {
      label: 'Actual work end datetime',
      value: actualWorkEndDateTime ? mojFilters.mojDate(actualWorkEndDateTime, 'datetime') : '',
    },
    { label: 'Visit rejection reason', value: event.visitRejectionReason || '' },
    { label: 'Visit rejection description', value: event.visitRejectionDescription || '' },
    { label: 'Visit cancel reason', value: event.visitCancelReason || '' },
    { label: 'Visit cancel description', value: event.visitCancelDescription || '' },
  ]

  return {
    title: event.visitType || 'Visit',
    properties,
  }
}

export const fromVisitHistory = (visitDetails: AlcoholMonitoringVisitDetails[]): TimelineItem[] => {
  return (visitDetails || []).map(event => {
    return {
      label: event.visitType,
      dateTime: event.actualWorkStartDateTime,
      cards: [visitDetailsToTimelineCard(event)],
    } as TimelineItem
  })
}

export default function alcoholMonitoringVisitsHistoryRouter(services: Services): Router {
  const router = Router()

  router.get(
    paths.ALCOHOL_MONITORING.VISITS_HISTORY,
    auditPageViewRequest({ services, page: Page.ALCOHOL_MONITORING_VISIT_HISTORY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }

      const visitDetails = await services.alcoholMonitoringVisitDetailsService.getVisitDetails({
        userToken: res.locals.user.token,
        legacySubjectId,
      })

      const backUrl = buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId })
      const timeline = fromVisitHistory(visitDetails)

      res.render('pages/alcohol-monitoring/visits-history', {
        legacySubjectId,
        timeline: timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
        backUrl,
      })
    },
  )

  return router
}
