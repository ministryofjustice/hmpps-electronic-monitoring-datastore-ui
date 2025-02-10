import { EquipmentDetails } from '../equipmentDetails'
import { TimelineEventModel } from './TimelineEvent'

export type EquipmentDetailsViewModel = {
  orderId: number
  equipmentDetails: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  orderId: number,
  equipmentDetails: EquipmentDetails[],
): EquipmentDetailsViewModel => ({
  orderId,
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
  backUrl: `/orders/${orderId}/summary`,
})

const construct = (orderId: number, events: EquipmentDetails[] = []): EquipmentDetailsViewModel => {
  return createViewModelFromApiDto(orderId, events)
}

export default {
  construct,
}
