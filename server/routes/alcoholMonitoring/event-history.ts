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
    const { violationAlertDateTime } = event.details
    const properties: TimelineCardProperty[] = [
      { label: 'Violation alert type', value: event.details.violationAlertType || '' },
      { label: 'Violation alert ID', value: event.details.violationAlertId || '' },
      {
        label: 'Violation alert date',
        value: violationAlertDateTime ? mojFilters.mojDate(violationAlertDateTime, 'date') : '',
      },
      {
        label: 'Violation alert time',
        value: violationAlertDateTime ? mojFilters.mojDate(violationAlertDateTime, 'time') : '',
      },
      { label: 'Violation alert response action', value: event.details.violationAlertResponseAction || '' },
      { label: 'Visit required', value: event.details.visitRequired || '' },
      { label: 'Probation interaction required', value: event.details.probationInteractionRequired || '' },
      { label: 'AMS interaction required', value: event.details.amsInteractionRequired || '' },
      { label: 'Multiple alerts', value: event.details.multipleAlerts || '' },
      { label: 'Additional alerts', value: event.details.additionalAlerts || '' },
    ]

    return {
      title: event.details?.violationAlertType || event.type,
      properties,
    }
  }

  const contactEventToTimelineCard = (event: AlcoholMonitoringContactEvent): TimelineCard => {
    const { contactDateTime } = event.details || {}

    const properties: TimelineCardProperty[] = [
      { label: 'Contact channel', value: event.details.channel || '' },
      { label: 'Contact date', value: contactDateTime ? mojFilters.mojDate(contactDateTime, 'date') : '' },
      { label: 'Contact time', value: contactDateTime ? mojFilters.mojDate(contactDateTime, 'time') : '' },
      { label: 'Reason for contact', value: event.details.reasonForContact || '' },
      { label: 'Outcome of contact', value: event.details.outcomeOfContact || '' },
      { label: 'Visit ID', value: event.details.visitId || '' },
      { label: 'Visit required', value: event.details.visitRequired || '' },
      { label: 'Inbound or outbound', value: event.details.inboundOrOutbound || '' },
      { label: 'From to', value: event.details.fromTo || '' },
      { label: 'Subject consent withdrawn', value: event.details.subjectConsentWithdrawn || '' },
      { label: 'Call outcome', value: event.details.callOutcome || '' },
      { label: 'Statement', value: event.details.statement || '' },
    ]

    return {
      title: event.details?.channel || event.type,
      properties,
    }
  }

  const violationEventToTimelineCard = (event: AlcoholMonitoringViolationEvent): TimelineCard => {
    const { nonComplianceDateTime, violationEventNotificationDateTime, dateResolved } = event.details

    const properties: TimelineCardProperty[] = [
      { label: 'Enforcement ID', value: event.details.enforcementId || '' },
      { label: 'Non-compliance reason', value: event.details.nonComplianceReason || '' },
      {
        label: 'Non-compliance date',
        value: nonComplianceDateTime ? mojFilters.mojDate(nonComplianceDateTime, 'date') : '',
      },
      {
        label: 'Non-compliance time',
        value: nonComplianceDateTime ? mojFilters.mojDate(nonComplianceDateTime, 'time') : '',
      },
      { label: 'Violation alert ID', value: event.details.violationAlertId || '' },
      { label: 'Violation alert description', value: event.details.violationAlertDescription || '' },
      {
        label: 'Violation event notification date',
        value: violationEventNotificationDateTime ? mojFilters.mojDate(violationEventNotificationDateTime, 'date') : '',
      },
      {
        label: 'Violation event notification time',
        value: violationEventNotificationDateTime ? mojFilters.mojDate(violationEventNotificationDateTime, 'time') : '',
      },
      { label: 'Action taken EMS', value: event.details.actionTakenEms || '' },
      { label: 'Non-compliance outcome', value: event.details.nonComplianceOutcome || '' },
      { label: 'Non-compliance resolved', value: event.details.nonComplianceResolved || '' },
      { label: 'Date resolved', value: dateResolved ? mojFilters.mojDate(dateResolved, 'date') : '' },
      { label: 'Open/closed', value: event.details.openClosed || '' },
      { label: 'Visit required', value: event.details.visitRequired || '' },
    ]

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
          card = contactEventToTimelineCard(event as AlcoholMonitoringContactEvent)
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
