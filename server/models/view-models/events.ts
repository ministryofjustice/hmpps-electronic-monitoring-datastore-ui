import { ContactEvent } from '../contactEvents'
import { IncidentEvent } from '../incidentEvents'
import { MonitoringEvent } from '../monitoringEvents'

type TimelineEventModel = {
  dateTime: Date
  date: string
  eventType: string
  properties: unknown
}

type EventsViewModel = {
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
      }
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl: `/orders/${orderId}`,
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
