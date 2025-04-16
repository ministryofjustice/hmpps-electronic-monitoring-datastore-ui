import z from 'zod'

export const AlcoholMonitoringServiceDetailsModel = z.object({
  legacySubjectId: z.string(),
  serviceStartDate: z.string().nullable(),
  serviceEndDate: z.string().nullable(),
  serviceAddress: z.string().nullable(),
  equipmentStartDate: z.string().nullable(),
  equipmentEndDate: z.string().nullable(),
  hmuSerialNumber: z.string().nullable(),
  deviceSerialNumber: z.string().nullable(),
})

export type AlcoholMonitoringServiceDetails = z.infer<typeof AlcoholMonitoringServiceDetailsModel>
