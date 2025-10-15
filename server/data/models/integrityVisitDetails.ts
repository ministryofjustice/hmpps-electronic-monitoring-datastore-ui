import z from 'zod'

export type IntegrityVisitDetailsAddress = z.infer<typeof IntegrityVisitDetailsAddress>
export const IntegrityVisitDetailsAddress = z.object({
  addressLine1: z.string().nullish(),
  addressLine2: z.string().nullish(),
  addressLine3: z.string().nullish(),
  addressLine4: z.string().nullish(),
  postcode: z.string().nullish(),
})

export type IntegrityVisitDetails = z.infer<typeof IntegrityVisitDetails>
export const IntegrityVisitDetails = z.object({
  legacySubjectId: z.string(),
  address: IntegrityVisitDetailsAddress.nullish(),
  actualWorkStartDateTime: z.string(),
  actualWorkEndDateTime: z.string().nullish(),
  visitNotes: z.string().nullish(),
  visitType: z.string().nullish(),
  visitOutcome: z.string().nullish(),
})
