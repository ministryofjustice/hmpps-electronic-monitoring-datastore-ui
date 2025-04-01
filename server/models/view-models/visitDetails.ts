import { VisitDetails } from '../visitDetails'
import { TimelineEventModel } from './TimelineEvent'

export type VisitDetailsViewModel = {
  legacySubjectId: number
  visitDetails: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (legacySubjectId: number, visitDetails: VisitDetails[]): VisitDetailsViewModel => ({
  legacySubjectId,
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
  backUrl: `/integrity/${legacySubjectId}/summary`,
})

const construct = (legacySubjectId: number, events: VisitDetails[] = []): VisitDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, events)
}

export default {
  construct,
}
