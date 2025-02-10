import z from 'zod'

export const VisitAddressDetailsModel = z.object({
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  addressLine3: z.string().nullable(),
  addressLine4: z.string().nullable(),
  postcode: z.string().nullable(),
})

export const VisitDetailsModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  address: VisitAddressDetailsModel.nullable(),
  actualWorkStartDateTime: z.string(),
  actualWorkEndDateTime: z.string().nullable(),
  visitNotes: z.string().nullable(),
  visitType: z.string().nullable(),
  visitOutcome: z.string().nullable(),
})

export type VisitDetails = z.infer<typeof VisitDetailsModel>
export type VisitAddressDetails = z.infer<typeof VisitAddressDetailsModel>
