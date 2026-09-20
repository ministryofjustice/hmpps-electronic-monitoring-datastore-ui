import z from 'zod'

export type IntegrityVisitDetailsAddress = z.infer<typeof IntegrityVisitDetailsAddress>
export const IntegrityVisitDetailsAddress = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  addressLine3: z.string().optional(),
  addressLine4: z.string().optional(),
  postcode: z.string().optional(),
})

export type IntegrityVisitDetails = z.infer<typeof IntegrityVisitDetails>
export const IntegrityVisitDetails = z.object({
  legacySubjectId: z.string(),
  address: IntegrityVisitDetailsAddress.optional(),
  actualWorkStartDateTime: z.string(),
  actualWorkEndDateTime: z.string().optional(),
  visitNotes: z.string().optional(),
  visitType: z.string().optional(),
  visitOutcome: z.string().optional(),
})
