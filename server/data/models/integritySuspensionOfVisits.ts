import z from 'zod'

export type IntegritySuspensionOfVisits = z.infer<typeof IntegritySuspensionOfVisits>
export const IntegritySuspensionOfVisits = z.object({
  legacySubjectId: z.string(),
  suspensionOfVisits: z.string().optional(),
  requestedDate: z.string().optional(),
  startDate: z.string().optional(),
  startTime: z.string().optional(),
  endDate: z.string().optional(),
})
