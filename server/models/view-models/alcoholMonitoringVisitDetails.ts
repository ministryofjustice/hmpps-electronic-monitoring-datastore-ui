import { AlcoholMonitoringVisitDetails } from '../../data/models/alcoholMonitoringVisitDetails'
import { AlcoholMonitoringTimelineEvent } from './alcoholMonitoringTimelineEvent'

export type AlcoholMonitoringVisitDetailsView = {
  legacySubjectId: string
  visitDetails: AlcoholMonitoringTimelineEvent[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  visitDetails: AlcoholMonitoringVisitDetails[],
): AlcoholMonitoringVisitDetailsView => ({
  legacySubjectId,
  visitDetails: visitDetails
    .map(details => {
      const dateTime = details.dateVisitRaised ? new Date(details.dateVisitRaised) : null

      return {
        isoDateTime: details.dateVisitRaised,
        dateTime,
        date: dateTime?.toDateString(),
        eventType: 'am-visit-details',
        properties: details,
      } as AlcoholMonitoringTimelineEvent
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

export const AlcoholMonitoringVisitDetailsView = {
  construct(
    legacySubjectId: string,
    backUrl: string,
    events: AlcoholMonitoringVisitDetails[] = [],
  ): AlcoholMonitoringVisitDetailsView {
    return createViewModelFromApiDto(legacySubjectId, backUrl, events)
  },
}
