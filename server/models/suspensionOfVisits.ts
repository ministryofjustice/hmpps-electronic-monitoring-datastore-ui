import z from 'zod'

export const SuspensionOfVisitsEventModel = z.object({
  legacySubjectId: z.number(),
  suspensionOfVisits: z.string(),
  suspensionOfVisitsRequestedDate: z.string().nullable(),
  suspensionOfVisitsStartDate: z.string().nullable(),
  suspensionOfVisitsEndDate: z.string().nullable(),
})

export type SuspensionOfVisitsEvent = z.infer<typeof SuspensionOfVisitsEventModel>

export default SuspensionOfVisitsEventModel
