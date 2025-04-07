import { AlcoholMonitoringEquipmentDetail } from '../../alcoholMonitoring/equipmentDetails'
import { TimelineEventModel } from '../TimelineEvent'

export type AlcoholMonitoringEquipmentDetailsViewModel = {
  legacySubjectId: string
  equipmentDetails: TimelineEventModel[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  equipmentDetails: AlcoholMonitoringEquipmentDetail[],
): AlcoholMonitoringEquipmentDetailsViewModel => ({
  legacySubjectId,
  equipmentDetails: equipmentDetails
    .map(details => {
      const relevantDate = details.deviceInstalledDateTime || details.hmuInstallDateTime
      const dateTime = relevantDate ? new Date(relevantDate) : null

      return {
        legacySubjectId: details.legacySubjectId,
        legacyOrderId: details.legacyOrderId,
        isoDateTime: details.deviceInstalledDateTime,
        dateTime,
        date: dateTime?.toDateString(),
        eventType: 'am-equipment-details',
        properties: details,
      } as TimelineEventModel
    })
    .sort((a, b) => {
      return a.dateTime.getTime() - b.dateTime.getTime()
    }),
  backUrl,
})

const construct = (
  legacySubjectId: string,
  backUrl: string,
  equipmentDetails: AlcoholMonitoringEquipmentDetail[] = [],
): AlcoholMonitoringEquipmentDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, equipmentDetails)
}

export default {
  construct,
}
