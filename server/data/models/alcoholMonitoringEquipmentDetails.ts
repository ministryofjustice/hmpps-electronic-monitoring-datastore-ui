import z from 'zod'

export type AlcoholMonitoringEquipmentDetails = z.infer<typeof AlcoholMonitoringEquipmentDetails>
export const AlcoholMonitoringEquipmentDetails = z.object({
  legacySubjectId: z.string(),
  deviceType: z.string().nullish(),
  deviceSerialNumber: z.string().nullish(),
  deviceAddressType: z.string().nullish(),
  legFitting: z.string().nullish(),
  deviceInstalledDateTime: z.string().nullish(),
  deviceRemovedDateTime: z.string().nullish(),
  hmuInstallDateTime: z.string().nullish(),
  hmuRemovedDateTime: z.string().nullish(),
})
