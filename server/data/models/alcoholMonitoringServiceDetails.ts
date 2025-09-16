import z from 'zod'

export type AlcoholMonitoringServiceDetails = z.infer<typeof AlcoholMonitoringServiceDetails>
export const AlcoholMonitoringServiceDetails = z.object({
  legacySubjectId: z.string(),
  serviceStartDate: z.string().nullish(),
  serviceEndDate: z.string().nullish(),
  serviceAddress: z.string().nullish(),
  equipmentStartDate: z.string().nullish(),
  equipmentEndDate: z.string().nullish(),
  hmuSerialNumber: z.string().nullish(),
  deviceSerialNumber: z.string().nullish(),
})
