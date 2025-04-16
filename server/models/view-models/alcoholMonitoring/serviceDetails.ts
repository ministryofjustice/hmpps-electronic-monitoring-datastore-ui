import { AlcoholMonitoringServiceDetails } from '../../alcoholMonitoring/serviceDetails'
import { AlcoholMonitoringTimelineEventModel } from '../../alcoholMonitoring/TimelineEvent'

export type AlcoholMonitoringServiceDetailsViewModel = {
  legacySubjectId: string
  serviceDetails: AlcoholMonitoringTimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  serviceDetails: AlcoholMonitoringServiceDetails[],
): AlcoholMonitoringServiceDetailsViewModel => ({
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
      } as AlcoholMonitoringTimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

const construct = (
  legacySubjectId: string,
  backUrl: string,
  serviceDetails: AlcoholMonitoringServiceDetails[] = [],
): AlcoholMonitoringServiceDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, serviceDetails)
}

export default {
  construct,
}
