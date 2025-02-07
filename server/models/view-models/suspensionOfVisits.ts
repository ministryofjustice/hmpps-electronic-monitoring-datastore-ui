import { SuspensionOfVisitsEvent } from '../suspensionOfVisits'

export type SuspensionOfVisitsViewModel = {
  orderId: number
  backUrl: string
  events: SuspensionOfVisitsEvent[]
}

const createViewModelFromApiDto = (orderId: number, events: SuspensionOfVisitsEvent[]): SuspensionOfVisitsViewModel => {
  const model = {
    orderId,
    backUrl: `/orders/${orderId}`,
    events: events.sort(
      (a, b) =>
        new Date(a.suspensionOfVisitsRequestedDate).getTime() - new Date(b.suspensionOfVisitsRequestedDate).getTime(),
    ),
  }
  return model
}

const construct = (orderId: number, events: SuspensionOfVisitsEvent[] = []): SuspensionOfVisitsViewModel => {
  return createViewModelFromApiDto(orderId, events)
}

export default {
  construct,
}
