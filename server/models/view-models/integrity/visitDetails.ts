import { IntegrityVisitDetails } from '../../integrity/visitDetails'
import { IntegrityTimelineEventModel } from '../../integrity/TimelineEvent'

export type IntegrityVisitDetailsViewModel = {
  legacySubjectId: number
  visitDetails: IntegrityTimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: number,
  backUrl: string,
  visitDetails: IntegrityVisitDetails[],
): IntegrityVisitDetailsViewModel => ({
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
      } as IntegrityTimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

const construct = (
  legacySubjectId: number,
  backUrl: string,
  events: IntegrityVisitDetails[] = [],
): IntegrityVisitDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, events)
}

export default {
  construct,
}
