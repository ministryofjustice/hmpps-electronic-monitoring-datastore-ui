import z from 'zod'

export const AlcoholMonitoringEquipmentDetailsModel = z.object({
  legacyOrderId: z.string(),
  legacySubjectId: z.string(),
  deviceType: z.string().nullable(),
  deviceSerialNumber: z.string().nullable(),
  deviceAddressType: z.string().nullable(),
  legFitting: z.string().nullable(),
  deviceInstalledDateTime: z.string().nullable(),
  deviceRemovedDateTime: z.string().nullable(),
  hmuInstallDateTime: z.string().nullable(),
  hmuRemovedDateTime: z.string().nullable(),
})

export type AlcoholMonitoringEquipmentDetails = z.infer<typeof AlcoholMonitoringEquipmentDetailsModel>
