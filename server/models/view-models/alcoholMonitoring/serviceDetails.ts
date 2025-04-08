import { AlcoholMonitoringServiceDetail } from '../../alcoholMonitoring/serviceDetail'
import { TimelineEventModel } from '../TimelineEvent'

export type AlcoholMonitoringServiceDetailsViewModel = {
  legacySubjectId: string
  serviceDetails: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  serviceDetails: AlcoholMonitoringServiceDetail[],
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
      } as TimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

const construct = (
  legacySubjectId: string,
  backUrl: string,
  serviceDetails: AlcoholMonitoringServiceDetail[] = [],
): AlcoholMonitoringServiceDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, serviceDetails)
}

export default {
  construct,
}
