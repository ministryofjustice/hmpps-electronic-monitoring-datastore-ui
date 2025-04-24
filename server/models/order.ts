import z from 'zod'

export const OrderModel = z.object({
  dataType: z.string(),
  legacySubjectId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  addressLine3: z.string().nullable(),
  addressPostcode: z.string().nullable(),
  alias: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  orderStartDate: z.string().nullable(),
  orderEndDate: z.string().nullable(),
})

export type Order = z.infer<typeof OrderModel>
