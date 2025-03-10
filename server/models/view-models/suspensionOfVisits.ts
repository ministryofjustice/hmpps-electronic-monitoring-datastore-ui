import { SuspensionOfVisitsEvent } from '../suspensionOfVisits'

export type SuspensionOfVisitsViewEvent = {
  isoDateTime: string
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

const parseDate = (dateTime: string | null) => (dateTime ? new Date(dateTime).toLocaleDateString('en-UK') : '')
const parseTime = (time: string | null) => (time ? time.split(':').slice(0, 2).join('') : '')

const parseEvents = (events: SuspensionOfVisitsEvent[]): SuspensionOfVisitsViewEvent[] =>
  events
    .sort(
      (a, b) =>
        new Date(a.suspensionOfVisitsRequestedDate).getTime() - new Date(b.suspensionOfVisitsRequestedDate).getTime(),
    )
    .map(event => {
      return {
        isoDateTime: event.suspensionOfVisitsRequestedDate,
        suspensionOfVisits: event.suspensionOfVisits,
        requestedDate: parseDate(event.suspensionOfVisitsRequestedDate),
        startDate: parseDate(event.suspensionOfVisitsStartDate),
        startTime: parseTime(event.suspensionOfVisitsStartTime),
        endDate: parseDate(event.suspensionOfVisitsEndDate),
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
