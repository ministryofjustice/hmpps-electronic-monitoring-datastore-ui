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
  const properties: TimelineCardProperty[] = []

  if (event.visitId) {
    properties.push({ label: 'Visit ID', value: event.visitId })
  }

  if (event.visitType) {
    properties.push({ label: 'Visit Type', value: event.visitType })
  }

  if (event.visitAttempt) {
    properties.push({ label: 'Visit Attempt', value: event.visitAttempt })
  }

  if (event.dateVisitRaised) {
    properties.push({ label: 'Date Visit Raised', value: mojFilters.mojDate(event.dateVisitRaised, 'date') })
  }

  if (event.visitAddress) {
    properties.push({ label: 'Visit Address', value: event.visitAddress })
  }

  if (event.visitNotes) {
    properties.push({ label: 'Visit Notes', value: event.visitNotes })
  }

  if (event.visitOutcome) {
    properties.push({ label: 'Visit Outcome', value: event.visitOutcome })
  }

  if (event.actualWorkStartDateTime) {
    properties.push({
      label: 'Actual Work Start Date',
      value: mojFilters.mojDate(event.actualWorkStartDateTime, 'date'),
    })
    properties.push({
      label: 'Actual Work Start Time',
      value: mojFilters.mojDate(event.actualWorkStartDateTime, 'time'),
    })
  }

  if (event.actualWorkEndDateTime) {
    properties.push({
      label: 'Actual Work End Date',
      value: mojFilters.mojDate(event.actualWorkEndDateTime, 'date'),
    })
    properties.push({
      label: 'Actual Work End Time',
      value: mojFilters.mojDate(event.actualWorkEndDateTime, 'time'),
    })
  }

  if (event.visitRejectionReason) {
    properties.push({ label: 'Visit Rejection Reason', value: event.visitRejectionReason })
  }

  if (event.visitRejectionDescription) {
    properties.push({ label: 'Visit Rejection Description', value: event.visitRejectionDescription })
  }

  if (event.visitCancelReason) {
    properties.push({ label: 'Visit Cancel Reason', value: event.visitCancelReason })
  }

  if (event.visitCancelDescription) {
    properties.push({ label: 'Visit Cancel Description', value: event.visitCancelDescription })
  }

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
