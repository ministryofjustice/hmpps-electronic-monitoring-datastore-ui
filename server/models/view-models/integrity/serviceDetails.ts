import { IntegrityServiceDetails } from '../../integrity/serviceDetails'
import { IntegrityTimelineEventModel } from '../../integrity/TimelineEvent'

export type IntegrityServiceDetailsViewModel = {
  legacySubjectId: string
  serviceDetails: IntegrityTimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  serviceDetails: IntegrityServiceDetails[],
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
  legacySubjectId: string,
  backUrl: string,
  serviceDetails: IntegrityServiceDetails[] = [],
): IntegrityServiceDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, serviceDetails)
}

export default {
  construct,
}
