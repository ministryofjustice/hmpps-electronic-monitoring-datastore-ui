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
    const { processedDateTime } = event.details

    const properties: TimelineCardProperty[] = [
      { label: 'Type', value: event.details.type || '' },
      { label: 'Processed date', value: processedDateTime ? mojFilters.mojDate(processedDateTime, 'date') : '' },
      { label: 'Processed time', value: processedDateTime ? mojFilters.mojDate(processedDateTime, 'time') : '' },
    ]

    return {
      title: event.type,
      properties,
    }
  }

  const incidentEventToTimelineCard = (event: IntegrityIncidentEvent): TimelineCard => {
    const properties: TimelineCardProperty[] = [{ label: 'Type', value: event.details.type || '' }]

    return {
      title: event.type,
      properties,
    }
  }

  const contactEventToTimelineCard = (event: IntegrityContactEvent): TimelineCard => {
    const { modifiedDateTime } = event.details

    const properties: TimelineCardProperty[] = [
      { label: 'Contact channel', value: event.details.channel || '' },
      { label: 'User', value: event.details.userName || '' },
      { label: 'Reason', value: event.details.reason || '' },
      { label: 'Outcome', value: event.details.outcome || '' },
      { label: 'Modified date', value: modifiedDateTime ? mojFilters.mojDate(modifiedDateTime, 'date') : '' },
      { label: 'Modified time', value: modifiedDateTime ? mojFilters.mojDate(modifiedDateTime, 'time') : '' },
    ]

    return {
      title: event.details?.type || event.type,
      properties,
    }
  }

  const violationEventToTimelineCard = (event: IntegrityViolationEvent): TimelineCard => {
    const {
      breachDateTime,
      breachIdentifiedDateTime,
      breachPackRequestedDate,
      breachPackSentDate,
      authorityFirstNotifiedDateTime,
      agencyResponseDate,
      warningLetterSentDateTime,
      subjectLetterSentDate,
      summonsServedDate,
      hearingDate,
      section9Date,
    } = event.details

    const properties: TimelineCardProperty[] = [
      { label: 'Breach details', value: event.details.breachDetails },
      { label: 'Breach enforcement outcome', value: event.details.breachEnforcementOutcome },
      { label: 'Breach date', value: breachDateTime ? mojFilters.mojDate(breachDateTime, 'date') : '' },
      { label: 'Breach time', value: breachDateTime ? mojFilters.mojDate(breachDateTime, 'time') : '' },
      {
        label: 'Breach identified date',
        value: breachIdentifiedDateTime ? mojFilters.mojDate(breachIdentifiedDateTime, 'date') : '',
      },
      {
        label: 'Breach identified time',
        value: breachIdentifiedDateTime ? mojFilters.mojDate(breachIdentifiedDateTime, 'time') : '',
      },
      {
        label: 'Breach pack requested date',
        value: breachPackRequestedDate ? mojFilters.mojDate(breachPackRequestedDate, 'date') : '',
      },
      {
        label: 'Breach pack sent date',
        value: breachPackSentDate ? mojFilters.mojDate(breachPackSentDate, 'date') : '',
      },

      {
        label: 'Authority first notified date',
        value: authorityFirstNotifiedDateTime ? mojFilters.mojDate(authorityFirstNotifiedDateTime, 'date') : '',
      },
      {
        label: 'Authority first notified time',
        value: authorityFirstNotifiedDateTime ? mojFilters.mojDate(authorityFirstNotifiedDateTime, 'time') : '',
      },

      { label: 'Agency action', value: event.details.agencyAction },
      { label: 'Agency action date', value: agencyResponseDate ? mojFilters.mojDate(agencyResponseDate, 'date') : '' },

      { label: 'Investigation outcome reason', value: event.details.investigationOutcomeReason },
      { label: 'Enforcement reason', value: event.details.enforcementReason },

      {
        label: 'Warning letter sent date',
        value: warningLetterSentDateTime ? mojFilters.mojDate(warningLetterSentDateTime, 'date') : '',
      },
      {
        label: 'Warning letter sent time',
        value: warningLetterSentDateTime ? mojFilters.mojDate(warningLetterSentDateTime, 'time') : '',
      },
      {
        label: 'Subject letter sent date',
        value: subjectLetterSentDate ? mojFilters.mojDate(subjectLetterSentDate, 'date') : '',
      },
      { label: 'Summons server date', value: summonsServedDate ? mojFilters.mojDate(summonsServedDate, 'date') : '' },
      { label: 'Hearing date', value: hearingDate ? mojFilters.mojDate(hearingDate, 'date') : '' },
      { label: 'Section 9 date', value: section9Date ? mojFilters.mojDate(section9Date, 'date') : '' },
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
          card = contactEventToTimelineCard(event as IntegrityContactEvent)
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
