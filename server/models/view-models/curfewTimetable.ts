import { IntegrityServiceDetail } from '../integrity/serviceDetail'
import { TimelineEventModel } from './TimelineEvent'

export type CurfewTimetableViewModel = {
  legacySubjectId: number
  curfewTimetable: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: number,
  backUrl: string,
  curfewTimetable: IntegrityServiceDetail[],
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
  backUrl,
})

const construct = (
  legacySubjectId: number,
  backUrl: string,
  events: IntegrityServiceDetail[] = [],
): CurfewTimetableViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, events)
}

export default {
  construct,
}
