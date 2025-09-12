import z from 'zod'

export const OrderModel = z.object({
  legacySubjectId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  primaryAddressLine1: z.string().nullable(),
  primaryAddressLine2: z.string().nullable(),
  primaryAddressLine3: z.string().nullable(),
  primaryAddressPostcode: z.string().optional(),
  alias: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  orderStartDate: z.string().nullable(),
  orderEndDate: z.string().nullable(),
})

export type Order = z.infer<typeof OrderModel>
