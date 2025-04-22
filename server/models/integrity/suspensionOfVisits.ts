import z from 'zod'

export const IntegritySuspensionOfVisitsEventModel = z.object({
  legacySubjectId: z.string(),
  suspensionOfVisits: z.string(),
  requestedDate: z.string().nullable(),
  startDate: z.string().nullable(),
  startTime: z.string().nullable(),
  endDate: z.string().nullable(),
})

export type IntegritySuspensionOfVisitsEvent = z.infer<typeof IntegritySuspensionOfVisitsEventModel>

export default IntegritySuspensionOfVisitsEventModel
