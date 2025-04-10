import { AlcoholMonitoringEquipmentDetail } from '../../alcoholMonitoring/equipmentDetails'
import { AlcoholMonitoringTimelineEventModel } from '../../alcoholMonitoring/TimelineEvent'

export type AlcoholMonitoringEquipmentDetailsViewModel = {
  legacySubjectId: string
  equipmentDetails: AlcoholMonitoringTimelineEventModel[]
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
        isoDateTime: details.deviceInstalledDateTime || details.hmuInstallDateTime,
        dateTime,
        date: dateTime?.toDateString(),
        eventType: 'am-equipment-details',
        properties: details,
      } as AlcoholMonitoringTimelineEventModel
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
