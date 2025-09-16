import { IntegrityVisitDetails } from '../../data/models/integrityVisitDetails'
import { IntegrityTimelineEvent } from './integrityTimelineEvent'

export type IntegrityVisitDetailsView = {
  legacySubjectId: string
  visitDetails: IntegrityTimelineEvent[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  visitDetails: IntegrityVisitDetails[],
): IntegrityVisitDetailsView => ({
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
      } as IntegrityTimelineEvent
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

export const IntegrityVisitDetailsView = {
  construct(legacySubjectId: string, backUrl: string, events: IntegrityVisitDetails[] = []): IntegrityVisitDetailsView {
    return createViewModelFromApiDto(legacySubjectId, backUrl, events)
  },
}
