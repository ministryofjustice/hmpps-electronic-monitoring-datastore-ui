import { SuspensionOfVisitsEvent } from '../suspensionOfVisits'

export type SuspensionOfVisitsViewEvent = {
  timestamp: string
  suspensionOfVisits: string
  requestedDate: string
  startDate: string
  endDate: string
}

export type SuspensionOfVisitsViewModel = {
  orderId: number
  backUrl: string
  events: SuspensionOfVisitsViewEvent[]
}

const extractDate = (dateTime: string | null) => (dateTime ? new Date(dateTime).toLocaleDateString('en-UK') : '')

const processEvents = (events: SuspensionOfVisitsEvent[]): SuspensionOfVisitsViewEvent[] =>
  events
    .sort(
      (a, b) =>
        new Date(a.suspensionOfVisitsRequestedDate).getTime() - new Date(b.suspensionOfVisitsRequestedDate).getTime(),
    )
    .map(event => {
      return {
        timestamp: event.suspensionOfVisitsRequestedDate,
        suspensionOfVisits: event.suspensionOfVisits,
        requestedDate: extractDate(event.suspensionOfVisitsRequestedDate),
        startDate: extractDate(event.suspensionOfVisitsStartDate),
        endDate: extractDate(event.suspensionOfVisitsEndDate),
      }
    })

const createViewModelFromApiDto = (orderId: number, events: SuspensionOfVisitsEvent[]): SuspensionOfVisitsViewModel => {
  return {
    orderId,
    backUrl: `/orders/${orderId}`,
    events: processEvents(events),
  }
}

const construct = (orderId: number, events: SuspensionOfVisitsEvent[] = []): SuspensionOfVisitsViewModel => {
  return createViewModelFromApiDto(orderId, events)
}

export default {
  construct,
}
