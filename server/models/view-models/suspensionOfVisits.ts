import { SuspensionOfVisitsEvent } from '../suspensionOfVisits'

export type SuspensionOfVisitsViewModel = {
  orderId: number
  backUrl: string
  events: SuspensionOfVisitsEvent[]
}

const sortEvents = (events: SuspensionOfVisitsEvent[]): SuspensionOfVisitsEvent[] =>
  events.sort((a, b) => new Date(a.requestedDate).getTime() - new Date(b.requestedDate).getTime())

const createViewModelFromApiDto = (orderId: number, events: SuspensionOfVisitsEvent[]): SuspensionOfVisitsViewModel => {
  return {
    orderId,
    backUrl: `/orders/${orderId}/summary`,
    events: sortEvents(events),
  }
}

const construct = (orderId: number, events: SuspensionOfVisitsEvent[] = []): SuspensionOfVisitsViewModel => {
  return createViewModelFromApiDto(orderId, events)
}

export default {
  construct,
}
