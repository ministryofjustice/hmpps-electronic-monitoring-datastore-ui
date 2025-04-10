import z from 'zod'

export const IntegrityVisitAddressDetailsModel = z.object({
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  addressLine3: z.string().nullable(),
  addressLine4: z.string().nullable(),
  postcode: z.string().nullable(),
})

export const IntegrityVisitDetailsModel = z.object({
  legacySubjectId: z.number(),
  address: IntegrityVisitAddressDetailsModel.nullable(),
  actualWorkStartDateTime: z.string(),
  actualWorkEndDateTime: z.string().nullable(),
  visitNotes: z.string().nullable(),
  visitType: z.string().nullable(),
  visitOutcome: z.string().nullable(),
})

export type IntegrityVisitDetails = z.infer<typeof IntegrityVisitDetailsModel>
export type IntegrityVisitAddressDetails = z.infer<typeof IntegrityVisitAddressDetailsModel>
