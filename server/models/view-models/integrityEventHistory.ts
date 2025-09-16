import { IntegrityContactEvent, IntegrityContactEventDetails } from '../../data/models/integrityContactEvent'
import { IntegrityIncidentEvent, IntegrityIncidentEventDetails } from '../../data/models/integrityIncidentEvent'
import { IntegrityMonitoringEvent, IntegrityMonitoringEventDetails } from '../../data/models/integrityMonitoringEvent'
import { IntegrityViolationEvent, IntegrityViolationEventDetails } from '../../data/models/integrityViolationEvent'

export type IntegrityEventHistoryEvent = {
  dateTime: Date
  date: string
  eventType: string
  properties:
    | IntegrityContactEventDetails
    | IntegrityIncidentEventDetails
    | IntegrityMonitoringEventDetails
    | IntegrityViolationEventDetails
}

export type IntegrityEventHistoryView = {
  legacySubjectId: string
  eventHistory: IntegrityEventHistoryEvent[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  eventHistory: (IntegrityContactEvent | IntegrityIncidentEvent | IntegrityMonitoringEvent | IntegrityViolationEvent)[],
): IntegrityEventHistoryView => ({
  legacySubjectId,
  eventHistory: eventHistory
    .map(event => {
      return {
        isoDateTime: event.dateTime,
        dateTime: new Date(event.dateTime),
        date: new Date(event.dateTime).toDateString(),
        eventType: event.type,
        properties: event.details,
      } as IntegrityEventHistoryEvent
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

export const IntegrityEventHistoryView = {
  construct(
    legacySubjectId: string,
    backUrl: string,
    eventHistory: (
      | IntegrityContactEvent
      | IntegrityIncidentEvent
      | IntegrityMonitoringEvent
      | IntegrityViolationEvent
    )[] = [],
  ): IntegrityEventHistoryView {
    return createViewModelFromApiDto(legacySubjectId, backUrl, eventHistory)
  },
}
