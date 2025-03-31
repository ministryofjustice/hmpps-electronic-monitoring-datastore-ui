import { CurfewTimetable } from '../curfewTimetable'
import { TimelineEventModel } from './TimelineEvent'

export type CurfewTimetableViewModel = {
  legacySubjectId: number
  curfewTimetable: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: number,
  curfewTimetable: CurfewTimetable[],
): CurfewTimetableViewModel => ({
  legacySubjectId,
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
  backUrl: `/orders/${legacySubjectId}/summary`,
})

const construct = (legacySubjectId: number, events: CurfewTimetable[] = []): CurfewTimetableViewModel => {
  return createViewModelFromApiDto(legacySubjectId, events)
}

export default {
  construct,
}
