import { CurfewTimetable } from '../curfewTimetable'
import { TimelineEventModel } from './TimelineEvent'

export type CurfewTimetableViewModel = {
  orderId: number
  curfewTimetable: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (orderId: number, curfewTimetable: CurfewTimetable[]): CurfewTimetableViewModel => ({
  orderId,
  curfewTimetable: curfewTimetable
    .map(details => {
      const dateTime = details.serviceStartDate ? new Date(details.serviceStartDate) : null

      return {
        isoDateTime: details.serviceStartDate,
        dateTime,
        date: dateTime?.toDateString(),
        eventType: 'curfew-timetable',
        properties: details,
      } as TimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl: `/orders/${orderId}/summary`,
})

const construct = (orderId: number, events: CurfewTimetable[] = []): CurfewTimetableViewModel => {
  return createViewModelFromApiDto(orderId, events)
}

export default {
  construct,
}
