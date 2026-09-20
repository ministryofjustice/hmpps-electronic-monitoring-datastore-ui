import z from 'zod'

export type AlcoholMonitoringEquipmentDetails = z.infer<typeof AlcoholMonitoringEquipmentDetails>
export const AlcoholMonitoringEquipmentDetails = z.object({
  legacySubjectId: z.string(),
  deviceType: z.string().optional(),
  deviceSerialNumber: z.string().optional(),
  deviceAddressType: z.string().optional(),
  legFitting: z.string().optional(),
  deviceInstalledDateTime: z.string().optional(),
  deviceRemovedDateTime: z.string().optional(),
  hmuInstallDateTime: z.string().optional(),
  hmuRemovedDateTime: z.string().optional(),
})
