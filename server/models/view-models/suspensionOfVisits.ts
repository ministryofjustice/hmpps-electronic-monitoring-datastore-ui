import { SuspensionOfVisitsEvent } from '../suspensionOfVisits'

// TODO: Duplicated in events view model. Export to a shared module.
export type TimelineEventModel = {
  dateTime: Date
  date: string
  eventType: string
  properties: unknown
}
// TODO: Duplicated in events view model. Export to a shared module.
export type EventsViewModel = {
  orderId: number
  events: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (orderId: number, events: SuspensionOfVisitsEvent[]): EventsViewModel => ({
  orderId,
  backUrl: `/orders/${orderId}`,
  events: events
    .map(event => {
      return {
        isoDateTime: event.requestedDate,
        dateTime: new Date(event.requestedDate),
        date: new Date(event.requestedDate).toDateString(),
        eventType: 'Suspension of visits',
        properties: event,
      }
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
})

const construct = (orderId: number, events: SuspensionOfVisitsEvent[] = []): EventsViewModel => {
  return createViewModelFromApiDto(orderId, events)
}

export default {
  construct,
}
