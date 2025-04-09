import { IntegrityServiceDetail } from '../../integrity/serviceDetail'
import { IntegrityTimelineEventModel } from '../../integrity/TimelineEvent'

export type IntegrityServiceDetailsViewModel = {
  legacySubjectId: number
  serviceDetails: IntegrityTimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: number,
  backUrl: string,
  serviceDetails: IntegrityServiceDetail[],
): IntegrityServiceDetailsViewModel => ({
  legacySubjectId,
  serviceDetails: serviceDetails
    .map(details => {
      const dateTime = details.serviceStartDate ? new Date(details.serviceStartDate) : null

      return {
        isoDateTime: details.serviceStartDate,
        dateTime,
        date: dateTime?.toDateString(),
        eventType: 'service-details',
        properties: details,
      } as IntegrityTimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

const construct = (
  legacySubjectId: number,
  backUrl: string,
  serviceDetails: IntegrityServiceDetail[] = [],
): IntegrityServiceDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, serviceDetails)
}

export default {
  construct,
}
