import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { HMPPS_AUTH_ROLES } from '../../constants/roles'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { IntegrityContactEvent } from '../../data/models/integrityContactEvent'
import { IntegrityIncidentEvent } from '../../data/models/integrityIncidentEvent'
import { IntegrityMonitoringEvent } from '../../data/models/integrityMonitoringEvent'
import { IntegrityViolationEvent } from '../../data/models/integrityViolationEvent'
import { TimelineCard, TimelineCardProperty, TimelineItem } from '../../models/view-models/timelineItems'

const mojFilters = allMojFilters()

export default function integrityEventsHistoryRouter(services: Services): Router {
  const router = Router()

  const monitoringEventToTimelineCard = (event: IntegrityMonitoringEvent): TimelineCard => {
    const properties: TimelineCardProperty[] = []

    if (event.details?.type) {
      properties.push({ label: 'Type', value: event.details.type })
    }

    if (event.details?.processedDateTime) {
      properties.push(
        {
          label: 'Processed date',
          value: mojFilters.mojDate(event.details.processedDateTime, 'date'),
        },
        {
          label: 'Processed time',
          value: mojFilters.mojDate(event.details.processedDateTime, 'time'),
        },
      )
    }

    return {
      title: event.type,
      properties,
    }
  }

  const incidentEventToTimelineCard = (event: IntegrityIncidentEvent): TimelineCard => {
    const properties: TimelineCardProperty[] = []

    if (event.details?.type) {
      properties.push({ label: 'Type', value: event.details.type })
    }

    return {
      title: event.type,
      properties,
    }
  }

  const contactEventToTimelineCard = (event: IntegrityContactEvent): TimelineCard => {
    const properties: TimelineCardProperty[] = []

    if (event.details?.type) {
      properties.push({ label: 'Type', value: event.details.type })
    }

    if (event.details?.channel) {
      properties.push({ label: 'Channel', value: event.details.channel })
    }

    if (event.details?.modifiedDateTime) {
      properties.push({ label: 'Modified date', value: mojFilters.mojDate(event.details.modifiedDateTime, 'date') })
      properties.push({ label: 'Modified time', value: mojFilters.mojDate(event.details.modifiedDateTime, 'time') })
    }

    if (event.details?.reason) {
      properties.push({ label: 'Reason', value: event.details.reason })
    }

    if (event.details?.outcome) {
      properties.push({ label: 'Outcome', value: event.details.outcome })
    }

    if (event.details?.userId) {
      properties.push({ label: 'User ID', value: event.details.userId })
    }

    if (event.details?.userName) {
      properties.push({ label: 'User Name', value: event.details.userName })
    }

    return {
      title: event.details?.type || event.type,
      properties,
    }
  }

  const violationEventToTimelineCard = (event: IntegrityViolationEvent): TimelineCard => {
    const properties: TimelineCardProperty[] = []

    if (event.details?.enforcementReason) {
      properties.push({ label: 'Enforcement Reason', value: event.details.enforcementReason })
    }

    if (event.details?.investigationOutcomeReason) {
      properties.push({ label: 'Investigation Outcome Reason', value: event.details.investigationOutcomeReason })
    }

    if (event.details?.breachDateTime) {
      properties.push({ label: 'Breach Date', value: mojFilters.mojDate(event.details.breachDateTime, 'date') })
      properties.push({ label: 'Breach Time', value: mojFilters.mojDate(event.details.breachDateTime, 'time') })
    }

    if (event.details?.breachDetails) {
      properties.push({ label: 'Breach Details', value: event.details.breachDetails })
    }

    if (event.details?.breachEnforcementOutcome) {
      properties.push({ label: 'Breach Enforcement Outcome', value: event.details.breachEnforcementOutcome })
    }

    if (event.details?.breachIdentifiedDateTime) {
      properties.push({
        label: 'Breach Identified Date',
        value: mojFilters.mojDate(event.details.breachIdentifiedDateTime, 'date'),
      })
      properties.push({
        label: 'Breach Identified Time',
        value: mojFilters.mojDate(event.details.breachIdentifiedDateTime, 'time'),
      })
    }

    if (event.details?.authorityFirstNotifiedDateTime) {
      properties.push({
        label: 'Authority First Notified Date',
        value: mojFilters.mojDate(event.details.authorityFirstNotifiedDateTime, 'date'),
      })
      properties.push({
        label: 'Authority First Notified Time',
        value: mojFilters.mojDate(event.details.authorityFirstNotifiedDateTime, 'time'),
      })
    }

    if (event.details?.breachPackRequestedDate) {
      properties.push({
        label: 'Breach Pack Requested Date',
        value: mojFilters.mojDate(event.details.breachPackRequestedDate, 'date'),
      })
    }

    if (event.details?.breachPackSentDate) {
      properties.push({
        label: 'Breach Pack Sent Date',
        value: mojFilters.mojDate(event.details.breachPackSentDate, 'date'),
      })
    }

    if (event.details?.agencyResponseDate) {
      properties.push({
        label: 'Agency Response Date',
        value: mojFilters.mojDate(event.details.agencyResponseDate, 'date'),
      })
    }

    if (event.details?.agencyAction) {
      properties.push({ label: 'Agency Action', value: event.details.agencyAction })
    }

    if (event.details?.section9Date) {
      properties.push({ label: 'Section 9 Date', value: mojFilters.mojDate(event.details.section9Date, 'date') })
    }

    if (event.details?.hearingDate) {
      properties.push({ label: 'Hearing Date', value: mojFilters.mojDate(event.details.hearingDate, 'date') })
    }

    if (event.details?.summonsServedDate) {
      properties.push({
        label: 'Summons Served Date',
        value: mojFilters.mojDate(event.details.summonsServedDate, 'date'),
      })
    }

    if (event.details?.subjectLetterSentDate) {
      properties.push({
        label: 'Subject Letter Sent Date',
        value: mojFilters.mojDate(event.details.subjectLetterSentDate, 'date'),
      })
    }

    if (event.details?.warningLetterSentDateTime) {
      properties.push({
        label: 'Warning Letter Sent Date',
        value: mojFilters.mojDate(event.details.warningLetterSentDateTime, 'date'),
      })
    }

    return {
      title: event.type,
      properties,
    }
  }

  const unknownEventToTimelineCard = (event: Record<string, unknown>): TimelineCard => {
    const properties: TimelineCardProperty[] = []
    Object.entries(event).forEach(([key, value]) => {
      properties.push({ label: key, value: String(value) })
    })

    return {
      title: 'Unknown Event',
      properties,
    }
  }

  const fromEventHistory = (
    eventHistory: (
      IntegrityMonitoringEvent | IntegrityIncidentEvent | IntegrityContactEvent | IntegrityViolationEvent
    )[],
  ): TimelineItem[] => {
    return (eventHistory || []).map(event => {
      let card: TimelineCard | undefined
      switch (event.type) {
        case 'monitoring':
          card = monitoringEventToTimelineCard(event as IntegrityMonitoringEvent)
          break
        case 'incident':
          card = incidentEventToTimelineCard(event as IntegrityIncidentEvent)
          break
        case 'contact':
          card = contactEventToTimelineCard(event.details as IntegrityContactEvent)
          break
        case 'violation':
          card = violationEventToTimelineCard(event as IntegrityViolationEvent)
          break
        default:
          card = unknownEventToTimelineCard(event)
          break
      }

      return {
        label: event.type,
        dateTime: event.dateTime,
        cards: [card],
      } as TimelineItem
    })
  }

  router.get(
    paths.INTEGRITY.EVENT_HISTORY,
    auditPageViewRequest({ services, page: Page.INTEGRITY_EVENT_HISTORY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }
      const restricted = res.locals.user.userRoles.includes(HMPPS_AUTH_ROLES.ROLE_EM_DATASTORE_RESTRICTED__RO)

      const eventHistory = await services.integrityEventHistoryService.getEventHistory({
        userToken: res.locals.user.token,
        legacySubjectId,
        restricted,
      })

      const backUrl = buildUrl(paths.INTEGRITY.SUMMARY, { legacySubjectId })
      const timeline = fromEventHistory(eventHistory)

      res.render('pages/integrity/event-history', {
        legacySubjectId,
        timeline: timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
        backUrl,
      })
    },
  )

  return router
}
