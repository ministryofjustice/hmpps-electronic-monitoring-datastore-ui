import { IntegrityEquipmentDetails } from '../../data/models/integrityEquipmentDetails'
import { IntegrityTimelineEvent } from './integrityTimelineEvent'

export type IntegrityEquipmentDetailsView = {
  legacySubjectId: string
  equipmentDetails: IntegrityTimelineEvent[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  equipmentDetails: IntegrityEquipmentDetails[],
): IntegrityEquipmentDetailsView => ({
  legacySubjectId,
  equipmentDetails: equipmentDetails
    .map(details => {
      const dateTime = details.pid?.installedDateTime ? new Date(details.pid.installedDateTime) : null

      return {
        isoDateTime: details.pid?.installedDateTime,
        dateTime,
        date: dateTime?.toDateString(),
        eventType: 'equipment-details',
        properties: details,
      } as IntegrityTimelineEvent
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

export const IntegrityEquipmentDetailsView = {
  construct(
    legacySubjectId: string,
    backUrl: string,
    events: IntegrityEquipmentDetails[] = [],
  ): IntegrityEquipmentDetailsView {
    return createViewModelFromApiDto(legacySubjectId, backUrl, events)
  },
}
