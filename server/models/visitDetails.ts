import z from 'zod'

export const VisitDetailsModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
})

export type VisitDetails = z.infer<typeof VisitDetailsModel>
