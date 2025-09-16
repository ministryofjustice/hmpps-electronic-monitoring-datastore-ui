import z from 'zod'

export type IntegritySuspensionOfVisits = z.infer<typeof IntegritySuspensionOfVisits>
export const IntegritySuspensionOfVisits = z.object({
  legacySubjectId: z.string(),
  suspensionOfVisits: z.string().nullish(),
  requestedDate: z.string().nullish(),
  startDate: z.string().nullish(),
  startTime: z.string().nullish(),
  endDate: z.string().nullish(),
})
