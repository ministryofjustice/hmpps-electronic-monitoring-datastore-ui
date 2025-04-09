import { IntegrityContactEvent, IntegrityContactEventDetails } from '../../integrity/contactEvents'
import { IntegrityIncidentEvent, IntegrityIncidentEventDetails } from '../../integrity/incidentEvents'
import { IntegrityMonitoringEvent, IntegrityMonitoringEventDetails } from '../../integrity/monitoringEvents'
import { IntegrityViolationEvent, IntegrityViolationEventDetails } from '../../integrity/violationEvents'

export type IntegrityEventHistoryEventModel = {
  dateTime: Date
  date: string
  eventType: string
  properties:
    | IntegrityContactEventDetails
    | IntegrityIncidentEventDetails
    | IntegrityMonitoringEventDetails
    | IntegrityViolationEventDetails
}

export type IntegrityEventHistoryViewModel = {
  legacySubjectId: number
  eventHistory: IntegrityEventHistoryEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: number,
  backUrl: string,
  eventHistory: (IntegrityContactEvent | IntegrityIncidentEvent | IntegrityMonitoringEvent | IntegrityViolationEvent)[],
): IntegrityEventHistoryViewModel => ({
  legacySubjectId,
  eventHistory: eventHistory
    .map(event => {
      return {
        isoDateTime: event.dateTime,
        dateTime: new Date(event.dateTime),
        date: new Date(event.dateTime).toDateString(),
        eventType: event.type,
        properties: event.details,
      } as IntegrityEventHistoryEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

const construct = (
  legacySubjectId: number,
  backUrl: string,
  eventHistory: (
    | IntegrityContactEvent
    | IntegrityIncidentEvent
    | IntegrityMonitoringEvent
    | IntegrityViolationEvent
  )[] = [],
): IntegrityEventHistoryViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, eventHistory)
}

export default {
  construct,
}
