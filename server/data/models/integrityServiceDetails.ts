import z from 'zod'

export type IntegrityServiceDetails = z.infer<typeof IntegrityServiceDetails>
export const IntegrityServiceDetails = z.object({
  legacySubjectId: z.string(),
  serviceId: z.number(),
  serviceAddress1: z.string().nullish(),
  serviceAddress2: z.string().nullish(),
  serviceAddress3: z.string().nullish(),
  serviceAddressPostCode: z.string().nullish(),
  serviceStartDate: z.string().nullish(),
  serviceEndDate: z.string().nullish(),
  curfewStartDate: z.string().nullish(),
  curfewEndDate: z.string().nullish(),
  monday: z.number(),
  tuesday: z.number(),
  wednesday: z.number(),
  thursday: z.number(),
  friday: z.number(),
  saturday: z.number(),
  sunday: z.number(),
})
