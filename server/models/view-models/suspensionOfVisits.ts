import { SuspensionOfVisits } from '../suspensionOfVisits'
import { TimelineEventModel } from './TimelineEvent'

export type SuspensionOfVisitsViewModel = {
  orderId: number
  suspensionOfVisits: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  orderId: number,
  suspensionOfVisits: SuspensionOfVisits[],
): SuspensionOfVisitsViewModel => ({
  orderId,
  suspensionOfVisits: suspensionOfVisits
    .map(details => {
      const dateTime = details.suspensionOfVisitsRequestedDate
        ? new Date(details.suspensionOfVisitsRequestedDate)
        : null

      return {
        isoDateTime: details.suspensionOfVisitsRequestedDate,
        dateTime,
        date: dateTime?.toDateString(),
        eventType: 'suspension-of-visits',
        properties: details,
      } as TimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl: `/orders/${orderId}/summary`,
})

const construct = (orderId: number, events: SuspensionOfVisits[] = []): SuspensionOfVisitsViewModel => {
  return createViewModelFromApiDto(orderId, events)
}

export default {
  construct,
}
