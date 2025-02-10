import { VisitDetails } from '../visitDetails'
import { TimelineEventModel } from './TimelineEvent'

export type VisitDetailsViewModel = {
  orderId: number
  visitDetails: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (orderId: number, visitDetails: VisitDetails[]): VisitDetailsViewModel => ({
  orderId,
  visitDetails: visitDetails
    .map(details => {
      const dateTime = details.actualWorkStartDateTime ? new Date(details.actualWorkStartDateTime) : null

      return {
        isoDateTime: details.actualWorkStartDateTime,
        dateTime,
        date: dateTime?.toDateString(),
        eventType: 'visit-details',
        properties: details,
      } as TimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl: `/orders/${orderId}/summary`,
})

const construct = (orderId: number, events: VisitDetails[] = []): VisitDetailsViewModel => {
  return createViewModelFromApiDto(orderId, events)
}

export default {
  construct,
}
