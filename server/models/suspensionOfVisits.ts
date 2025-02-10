import z from 'zod'

export const SuspensionOfVisitsModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  suspensionOfVisits: z.string().nullable(),
  suspensionOfVisitsRequestedDate: z.string().nullable(),
  suspensionOfVisitsStartDate: z.string().nullable(),
  suspensionOfVisitsEndDate: z.string().nullable(),
})

export type SuspensionOfVisits = z.infer<typeof SuspensionOfVisitsModel>
