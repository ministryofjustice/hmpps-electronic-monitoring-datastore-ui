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
  orderId: number
  events: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  orderId: number,
  events: (MonitoringEvent | IncidentEvent | ContactEvent)[],
): EventsViewModel => ({
  orderId,
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
  backUrl: `/orders/${orderId}/summary`,
})

const construct = (
  orderId: number,
  events: (MonitoringEvent | IncidentEvent | ContactEvent)[] = [],
): EventsViewModel => {
  return createViewModelFromApiDto(orderId, events)
}

export default {
  construct,
}
