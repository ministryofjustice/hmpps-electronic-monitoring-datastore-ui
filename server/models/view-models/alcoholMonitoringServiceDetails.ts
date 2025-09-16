import { AlcoholMonitoringServiceDetails } from '../../data/models/alcoholMonitoringServiceDetails'
import { AlcoholMonitoringTimelineEvent } from './alcoholMonitoringTimelineEvent'

export type AlcoholMonitoringServiceDetailsView = {
  legacySubjectId: string
  serviceDetails: AlcoholMonitoringTimelineEvent[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  serviceDetails: AlcoholMonitoringServiceDetails[],
): AlcoholMonitoringServiceDetailsView => ({
  legacySubjectId,
  serviceDetails: serviceDetails
    .map(details => {
      const dateTime = details.serviceStartDate ? new Date(details.serviceStartDate) : null

      return {
        isoDateTime: details.serviceStartDate,
        dateTime,
        date: dateTime?.toDateString(),
        eventType: 'am-service-details',
        properties: details,
      } as AlcoholMonitoringTimelineEvent
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

export const AlcoholMonitoringServiceDetailsView = {
  construct(
    legacySubjectId: string,
    backUrl: string,
    serviceDetails: AlcoholMonitoringServiceDetails[] = [],
  ): AlcoholMonitoringServiceDetailsView {
    return createViewModelFromApiDto(legacySubjectId, backUrl, serviceDetails)
  },
}
