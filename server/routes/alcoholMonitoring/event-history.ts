import allMojFilters from '@ministryofjustice/frontend/moj/filters/all'

import { Request, Response, Router } from 'express'

import { Page } from '../../constants/pages'
import { paths } from '../../constants/paths'
import { buildUrl } from '../../utils/utils'

import type { Services } from '../../services'

import auditPageViewRequest from '../../middleware/auditPageViewRequest'

import { AlcoholMonitoringContactEvent } from '../../data/models/alcoholMonitoringContactEvent'
import { AlcoholMonitoringIncidentEvent } from '../../data/models/alcoholMonitoringIncidentEvent'
import { AlcoholMonitoringViolationEvent } from '../../data/models/alcoholMonitoringViolationEvent'
import { TimelineCard, TimelineCardProperty, TimelineItem } from '../../models/view-models/timelineItems'

const mojFilters = allMojFilters()

export default function alcoholMonitoringEventsHistoryRouter(services: Services): Router {
  const router = Router()

  const incidentEventToTimelineCard = (event: AlcoholMonitoringIncidentEvent): TimelineCard => {
    const properties: TimelineCardProperty[] = []

    if (event.details?.violationAlertId) {
      properties.push({ label: 'Violation Alert ID', value: event.details.violationAlertId })
    }

    if (event.details?.violationAlertDateTime) {
      properties.push({
        label: 'Violation Alert Date',
        value: mojFilters.mojDate(event.details.violationAlertDateTime, 'date'),
      })
      properties.push({
        label: 'Violation Alert Time',
        value: mojFilters.mojDate(event.details.violationAlertDateTime, 'time'),
      })
    }

    if (event.details?.violationAlertType) {
      properties.push({ label: 'Violation Alert Type', value: event.details.violationAlertType })
    }

    if (event.details?.violationAlertResponseAction) {
      properties.push({ label: 'Violation Alert Response Action', value: event.details.violationAlertResponseAction })
    }

    if (event.details?.visitRequired) {
      properties.push({ label: 'Visit Required', value: event.details.visitRequired })
    }

    if (event.details?.probationInteractionRequired) {
      properties.push({ label: 'Probation Interaction Required', value: event.details.probationInteractionRequired })
    }

    if (event.details?.amsInteractionRequired) {
      properties.push({ label: 'AMS Interaction Required', value: event.details.amsInteractionRequired })
    }

    if (event.details?.multipleAlerts) {
      properties.push({ label: 'Multiple Alerts', value: event.details.multipleAlerts })
    }

    if (event.details?.additionalAlerts) {
      properties.push({ label: 'Additional Alerts', value: event.details.additionalAlerts })
    }

    return {
      title: event.details?.violationAlertType || event.type,
      properties,
    }
  }

  const contactEventToTimelineCard = (event: AlcoholMonitoringContactEvent): TimelineCard => {
    const properties: TimelineCardProperty[] = []

    if (event.details?.visitId) {
      properties.push({ label: 'Visit ID', value: event.details.visitId })
    }

    if (event.details?.contactDateTime) {
      properties.push({ label: 'Contact Date', value: mojFilters.mojDate(event.details.contactDateTime, 'date') })
      properties.push({ label: 'Contact Time', value: mojFilters.mojDate(event.details.contactDateTime, 'time') })
    }

    if (event.details?.inboundOrOutbound) {
      properties.push({ label: 'Inbound or Outbound', value: event.details.inboundOrOutbound })
    }

    if (event.details?.fromTo) {
      properties.push({ label: 'From/To', value: event.details.fromTo })
    }

    if (event.details?.channel) {
      properties.push({ label: 'Channel', value: event.details.channel })
    }

    if (event.details?.subjectConsentWithdrawn) {
      properties.push({ label: 'Subject Consent Withdrawn', value: event.details.subjectConsentWithdrawn })
    }

    if (event.details?.callOutcome) {
      properties.push({ label: 'Call Outcome', value: event.details.callOutcome })
    }

    if (event.details?.statement) {
      properties.push({ label: 'Statement', value: event.details.statement })
    }

    if (event.details?.reasonForContact) {
      properties.push({ label: 'Reason for Contact', value: event.details.reasonForContact })
    }

    if (event.details?.outcomeOfContact) {
      properties.push({ label: 'Outcome of Contact', value: event.details.outcomeOfContact })
    }

    if (event.details?.visitRequired) {
      properties.push({ label: 'Visit Required', value: event.details.visitRequired })
    }

    return {
      title: event.details?.channel || event.type,
      properties,
    }
  }

  const violationEventToTimelineCard = (event: AlcoholMonitoringViolationEvent): TimelineCard => {
    const properties: TimelineCardProperty[] = []

    if (event.details?.violationAlertId) {
      properties.push({ label: 'Violation Alert ID', value: event.details.violationAlertId })
    }

    if (event.details?.violationAlertDescription) {
      properties.push({ label: 'Violation Alert Description', value: event.details.violationAlertDescription })
    }

    if (event.details?.violationEventNotificationDateTime) {
      properties.push({
        label: 'Violation Event Notification Date',
        value: mojFilters.mojDate(event.details.violationEventNotificationDateTime, 'date'),
      })
      properties.push({
        label: 'Violation Event Notification Time',
        value: mojFilters.mojDate(event.details.violationEventNotificationDateTime, 'time'),
      })
    }

    if (event.details?.nonComplianceReason) {
      properties.push({ label: 'Non-Compliance Reason', value: event.details.nonComplianceReason })
    }

    if (event.details?.nonComplianceDateTime) {
      properties.push({
        label: 'Non-Compliance Date',
        value: mojFilters.mojDate(event.details.nonComplianceDateTime, 'date'),
      })
      properties.push({
        label: 'Non-Compliance Time',
        value: mojFilters.mojDate(event.details.nonComplianceDateTime, 'time'),
      })
    }

    if (event.details?.nonComplianceOutcome) {
      properties.push({ label: 'Non-Compliance Outcome', value: event.details.nonComplianceOutcome })
    }

    if (event.details?.nonComplianceResolved) {
      properties.push({ label: 'Non-Compliance Resolved', value: event.details.nonComplianceResolved })
    }

    if (event.details?.enforcementId) {
      properties.push({ label: 'Enforcement ID', value: event.details.enforcementId })
    }

    if (event.details?.actionTakenEms) {
      properties.push({ label: 'Action Taken EMS', value: event.details.actionTakenEms })
    }

    if (event.details?.dateResolved) {
      properties.push({ label: 'Date Resolved', value: mojFilters.mojDate(event.details.dateResolved, 'date') })
    }

    if (event.details?.openClosed) {
      properties.push({ label: 'Open/Closed', value: event.details.openClosed })
    }

    if (event.details?.visitRequired) {
      properties.push({ label: 'Visit Required', value: event.details.visitRequired })
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
    eventHistory: (AlcoholMonitoringIncidentEvent | AlcoholMonitoringContactEvent | AlcoholMonitoringViolationEvent)[],
  ): TimelineItem[] => {
    return (eventHistory || []).map(event => {
      let card: TimelineCard | undefined
      switch (event.type) {
        case 'incident':
          card = incidentEventToTimelineCard(event as AlcoholMonitoringIncidentEvent)
          break
        case 'contact':
          card = contactEventToTimelineCard(event.details as AlcoholMonitoringContactEvent)
          break
        case 'violation':
          card = violationEventToTimelineCard(event as AlcoholMonitoringViolationEvent)
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
    paths.ALCOHOL_MONITORING.EVENT_HISTORY,
    auditPageViewRequest({ services, page: Page.ALCOHOL_MONITORING_EVENT_HISTORY }),
    async (req: Request, res: Response) => {
      const { legacySubjectId } = req.params as { legacySubjectId: string }

      const eventHistory = await services.alcoholMonitoringEventHistoryService.getEventHistory({
        userToken: res.locals.user.token,
        legacySubjectId,
      })

      const backUrl = buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId })
      const timeline = fromEventHistory(eventHistory)

      res.render('pages/alcohol-monitoring/event-history', {
        legacySubjectId,
        timeline: timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime)),
        backUrl,
      })
    },
  )

  return router
}
