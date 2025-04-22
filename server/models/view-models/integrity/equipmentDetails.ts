import { IntegrityEquipmentDetails } from '../../integrity/equipmentDetails'
import { IntegrityTimelineEventModel } from '../../integrity/TimelineEvent'

export type IntegrityEquipmentDetailsViewModel = {
  legacySubjectId: string
  equipmentDetails: IntegrityTimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  equipmentDetails: IntegrityEquipmentDetails[],
): IntegrityEquipmentDetailsViewModel => ({
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
      } as IntegrityTimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

const construct = (
  legacySubjectId: string,
  backUrl: string,
  events: IntegrityEquipmentDetails[] = [],
): IntegrityEquipmentDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, events)
}

export default {
  construct,
}
