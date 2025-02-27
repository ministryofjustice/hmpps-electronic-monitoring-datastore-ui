import z from 'zod'

export const SuspensionOfVisitsEventModel = z.object({
  legacySubjectId: z.number(),
  suspensionOfVisits: z.string(),
  requestedDate: z.string().nullable(),
  startDate: z.string().nullable(),
  startTime: z.string().nullable(),
  endDate: z.string().nullable(),
})

export type SuspensionOfVisitsEvent = z.infer<typeof SuspensionOfVisitsEventModel>

export default SuspensionOfVisitsEventModel
