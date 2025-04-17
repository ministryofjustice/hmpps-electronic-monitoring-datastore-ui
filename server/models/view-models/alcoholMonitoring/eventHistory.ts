import {
  AlcoholMonitoringContactEvent,
  AlcoholMonitoringContactEventDetails,
} from '../../alcoholMonitoring/contactEvents'
import {
  AlcoholMonitoringIncidentEvent,
  AlcoholMonitoringIncidentEventDetails,
} from '../../alcoholMonitoring/incidentEvents'
import {
  AlcoholMonitoringViolationEvent,
  AlcoholMonitoringViolationEventDetails,
} from '../../alcoholMonitoring/violationEvents'

export type AlcoholMonitoringEventHistoryEventModel = {
  dateTime: Date
  date: string
  eventType: string
  properties:
    | AlcoholMonitoringContactEventDetails
    | AlcoholMonitoringIncidentEventDetails
    | AlcoholMonitoringViolationEventDetails
}

export type AlcoholMonitoringEventHistoryViewModel = {
  legacySubjectId: string
  eventHistory: AlcoholMonitoringEventHistoryEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  eventHistory: (AlcoholMonitoringContactEvent | AlcoholMonitoringIncidentEvent | AlcoholMonitoringViolationEvent)[],
): AlcoholMonitoringEventHistoryViewModel => ({
  legacySubjectId,
  eventHistory: eventHistory
    .map(event => {
      return {
        isoDateTime: event.dateTime,
        dateTime: new Date(event.dateTime),
        date: new Date(event.dateTime).toDateString(),
        eventType: event.type,
        properties: event.details,
      } as AlcoholMonitoringEventHistoryEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

const construct = (
  legacySubjectId: string,
  backUrl: string,
  eventHistory: (
    | AlcoholMonitoringContactEvent
    | AlcoholMonitoringIncidentEvent
    | AlcoholMonitoringViolationEvent
  )[] = [],
): AlcoholMonitoringEventHistoryViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, eventHistory)
}

export default {
  construct,
}
