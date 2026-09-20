import z from 'zod'

export type AlcoholMonitoringServiceDetails = z.infer<typeof AlcoholMonitoringServiceDetails>
export const AlcoholMonitoringServiceDetails = z.object({
  legacySubjectId: z.string(),
  serviceStartDate: z.string().optional(),
  serviceEndDate: z.string().optional(),
  serviceAddress: z.string().optional(),
  equipmentStartDate: z.string().optional(),
  equipmentEndDate: z.string().optional(),
  hmuSerialNumber: z.string().optional(),
  deviceSerialNumber: z.string().optional(),
})
