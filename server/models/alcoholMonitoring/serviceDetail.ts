import z from 'zod'

export const AlcoholMonitoringServiceDetailModel = z.object({
  legacySubjectId: z.string(),
  legacyOrderId: z.string(),
  serviceStartDate: z.string().nullable(),
  serviceEndDate: z.string().nullable(),
  serviceAddress: z.string().nullable(),
  equipmentStartDate: z.string().nullable(),
  equipmentEndDate: z.string().nullable(),
  hmuSerialNumber: z.string().nullable(),
  deviceSerialNumber: z.string().nullable(),
})

export type AlcoholMonitoringServiceDetail = z.infer<typeof AlcoholMonitoringServiceDetailModel>
