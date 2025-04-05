import { ContactEvent } from '../contactEvents'
import { IncidentEvent } from '../incidentEvents'
import { MonitoringEvent } from '../monitoringEvents'

export type TimelineEventModel = {
  dateTime: Date
  date: string
  eventType: string
  properties: unknown
}

export type EventsViewModel = {
  legacySubjectId: number
  events: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: number,
  backUrl: string,
  events: (MonitoringEvent | IncidentEvent | ContactEvent)[],
): EventsViewModel => ({
  legacySubjectId,
  events: events
    .map(event => {
      return {
        isoDateTime: event.dateTime,
        dateTime: new Date(event.dateTime),
        date: new Date(event.dateTime).toDateString(),
        eventType: event.type,
        properties: event.details,
      } as TimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

const construct = (
  legacySubjectId: number,
  backUrl: string,
  events: (MonitoringEvent | IncidentEvent | ContactEvent)[] = [],
): EventsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, events)
}

export default {
  construct,
}
