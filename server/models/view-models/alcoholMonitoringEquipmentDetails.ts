import { AlcoholMonitoringEquipmentDetails } from '../../data/models/alcoholMonitoringEquipmentDetails'
import { AlcoholMonitoringTimelineEvent } from './alcoholMonitoringTimelineEvent'

export type AlcoholMonitoringEquipmentDetailsView = {
  legacySubjectId: string
  equipmentDetails: AlcoholMonitoringTimelineEvent[]
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  equipmentDetails: AlcoholMonitoringEquipmentDetails[],
): AlcoholMonitoringEquipmentDetailsView => ({
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
      } as AlcoholMonitoringTimelineEvent
    })
    .sort((a, b) => {
      return a.dateTime.getTime() - b.dateTime.getTime()
    }),
  backUrl,
})

export const AlcoholMonitoringEquipmentDetailsView = {
  construct(
    legacySubjectId: string,
    backUrl: string,
    equipmentDetails: AlcoholMonitoringEquipmentDetails[] = [],
  ): AlcoholMonitoringEquipmentDetailsView {
    return createViewModelFromApiDto(legacySubjectId, backUrl, equipmentDetails)
  },
}
