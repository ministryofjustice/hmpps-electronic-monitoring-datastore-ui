import z from 'zod'

export type IntegrityServiceDetails = z.infer<typeof IntegrityServiceDetails>
export const IntegrityServiceDetails = z.object({
  legacySubjectId: z.string(),
  serviceId: z.number(),
  serviceAddress1: z.string().optional(),
  serviceAddress2: z.string().optional(),
  serviceAddress3: z.string().optional(),
  serviceAddressPostCode: z.string().optional(),
  serviceStartDate: z.string().optional(),
  serviceEndDate: z.string().optional(),
  curfewStartDate: z.string().optional(),
  curfewEndDate: z.string().optional(),
  monday: z.number(),
  tuesday: z.number(),
  wednesday: z.number(),
  thursday: z.number(),
  friday: z.number(),
  saturday: z.number(),
  sunday: z.number(),
})
