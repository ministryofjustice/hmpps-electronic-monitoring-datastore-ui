import z from 'zod'

export const AlcoholMonitoringEquipmentDetailModel = z.object({
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

export type AlcoholMonitoringEquipmentDetail = z.infer<typeof AlcoholMonitoringEquipmentDetailModel>
