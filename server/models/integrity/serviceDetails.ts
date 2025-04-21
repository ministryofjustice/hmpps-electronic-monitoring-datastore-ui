import z from 'zod'

export const IntegrityServiceDetailsModel = z.object({
  legacySubjectId: z.number(),
  serviceId: z.number().nullable(),
  serviceAddress1: z.string().nullable(),
  serviceAddress2: z.string().nullable(),
  serviceAddress3: z.string().nullable(),
  serviceAddressPostcode: z.string().nullable(),
  serviceStartDate: z.string().nullable(),
  serviceEndDate: z.string().nullable(),
  curfewStartDate: z.string().nullable(),
  curfewEndDate: z.string().nullable(),
  monday: z.number().nullable(),
  tuesday: z.number().nullable(),
  wednesday: z.number().nullable(),
  thursday: z.number().nullable(),
  friday: z.number().nullable(),
  saturday: z.number().nullable(),
  sunday: z.number().nullable(),
})

export type IntegrityServiceDetails = z.infer<typeof IntegrityServiceDetailsModel>
