import { IntegrityServiceDetails } from '../../data/models/integrityServiceDetails'
import { IntegrityTimelineEvent } from './integrityTimelineEvent'

export type IntegrityServiceDetailsView = {
  legacySubjectId: string
  serviceDetails: IntegrityTimelineEvent[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  serviceDetails: IntegrityServiceDetails[],
): IntegrityServiceDetailsView => ({
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
      } as IntegrityTimelineEvent
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

export const IntegrityServiceDetailsView = {
  construct(
    legacySubjectId: string,
    backUrl: string,
    serviceDetails: IntegrityServiceDetails[] = [],
  ): IntegrityServiceDetailsView {
    return createViewModelFromApiDto(legacySubjectId, backUrl, serviceDetails)
  },
}
