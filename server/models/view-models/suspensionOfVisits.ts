import { SuspensionOfVisitsEvent } from '../suspensionOfVisits'

export type SuspensionOfVisitsViewEvent = {
  isoDateTime: string
  eventType: string
  suspensionOfVisits: string
  requestedDate: string
  startDate: string
  startTime: string
  endDate: string
}

export type SuspensionOfVisitsViewModel = {
  orderId: number
  backUrl: string
  events: SuspensionOfVisitsViewEvent[]
}

const parseEvents = (events: SuspensionOfVisitsEvent[]): SuspensionOfVisitsViewEvent[] =>
  events
    .sort((a, b) => new Date(a.requestedDate).getTime() - new Date(b.requestedDate).getTime())
    .map(event => {
      return {
        isoDateTime: event.requestedDate,
        eventType: 'suspension-of-visits',
        suspensionOfVisits: event.suspensionOfVisits,
        requestedDate: event.requestedDate,
        startDate: event.startDate,
        startTime: event.startTime,
        endDate: event.endDate,
      }
    })

const createViewModelFromApiDto = (orderId: number, events: SuspensionOfVisitsEvent[]): SuspensionOfVisitsViewModel => {
  return {
    orderId,
    backUrl: `/orders/${orderId}/summary`,
    events: parseEvents(events),
  }
}

const construct = (orderId: number, events: SuspensionOfVisitsEvent[] = []): SuspensionOfVisitsViewModel => {
  return createViewModelFromApiDto(orderId, events)
}

export default {
  construct,
}
