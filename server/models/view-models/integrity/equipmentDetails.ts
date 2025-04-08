import { IntegrityEquipmentDetails } from '../../integrity/equipmentDetails'
import { TimelineEventModel } from '../TimelineEvent'

export type IntegrityEquipmentDetailsViewModel = {
  legacySubjectId: number
  equipmentDetails: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: number,
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
      } as TimelineEventModel
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
  backUrl,
})

const construct = (
  legacySubjectId: number,
  backUrl: string,
  events: IntegrityEquipmentDetails[] = [],
): IntegrityEquipmentDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, events)
}

export default {
  construct,
}
