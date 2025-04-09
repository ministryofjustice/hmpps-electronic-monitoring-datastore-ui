import { AlcoholMonitoringVisitDetails } from '../../alcoholMonitoring/visitDetails'
import { AlcoholMonitoringTimelineEventModel } from '../../alcoholMonitoring/TimelineEvent'

export type AlcoholMonitoringVisitDetailsViewModel = {
  legacySubjectId: string
  visitDetails: AlcoholMonitoringTimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  visitDetails: AlcoholMonitoringVisitDetails[],
): AlcoholMonitoringVisitDetailsViewModel => ({
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
      } as AlcoholMonitoringTimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

const construct = (
  legacySubjectId: string,
  backUrl: string,
  events: AlcoholMonitoringVisitDetails[] = [],
): AlcoholMonitoringVisitDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, events)
}

export default {
  construct,
}
