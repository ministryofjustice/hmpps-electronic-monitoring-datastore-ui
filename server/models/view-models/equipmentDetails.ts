import { EquipmentDetails } from '../equipmentDetails'
import { TimelineEventModel } from './TimelineEvent'

export type EquipmentDetailsViewModel = {
  legacySubjectId: number
  equipmentDetails: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: number,
  equipmentDetails: EquipmentDetails[],
): EquipmentDetailsViewModel => ({
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
  backUrl: `/orders/${legacySubjectId}/summary`,
})

const construct = (legacySubjectId: number, events: EquipmentDetails[] = []): EquipmentDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, events)
}

export default {
  construct,
}
