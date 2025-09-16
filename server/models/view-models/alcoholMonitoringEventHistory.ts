import {
  AlcoholMonitoringContactEvent,
  AlcoholMonitoringContactEventDetails,
} from '../../data/models/alcoholMonitoringContactEvent'
import {
  AlcoholMonitoringIncidentEvent,
  AlcoholMonitoringIncidentEventDetails,
} from '../../data/models/alcoholMonitoringIncidentEvent'
import {
  AlcoholMonitoringViolationEvent,
  AlcoholMonitoringViolationEventDetails,
} from '../../data/models/alcoholMonitoringViolationEvent'

export type AlcoholMonitoringEventHistoryEvent = {
  dateTime: Date
  date: string
  eventType: string
  properties:
    | AlcoholMonitoringContactEventDetails
    | AlcoholMonitoringIncidentEventDetails
    | AlcoholMonitoringViolationEventDetails
}

export type AlcoholMonitoringEventHistoryView = {
  legacySubjectId: string
  eventHistory: AlcoholMonitoringEventHistoryEvent[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  eventHistory: (AlcoholMonitoringContactEvent | AlcoholMonitoringIncidentEvent | AlcoholMonitoringViolationEvent)[],
): AlcoholMonitoringEventHistoryView => ({
  legacySubjectId,
  eventHistory: eventHistory
    .map(event => {
      return {
        isoDateTime: event.dateTime,
        dateTime: new Date(event.dateTime),
        date: new Date(event.dateTime).toDateString(),
        eventType: event.type,
        properties: event.details,
      } as AlcoholMonitoringEventHistoryEvent
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

export const AlcoholMonitoringEventHistoryView = {
  construct(
    legacySubjectId: string,
    backUrl: string,
    eventHistory: (
      | AlcoholMonitoringContactEvent
      | AlcoholMonitoringIncidentEvent
      | AlcoholMonitoringViolationEvent
    )[] = [],
  ): AlcoholMonitoringEventHistoryView {
    return createViewModelFromApiDto(legacySubjectId, backUrl, eventHistory)
  },
}
