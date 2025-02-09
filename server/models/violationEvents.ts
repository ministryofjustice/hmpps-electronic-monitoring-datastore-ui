import z from 'zod'

export const ViolationEventModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  type: z.string(),
  dateTime: z.string(),
  details: z.object({}).passthrough(),
})

export type ViolationEvent = z.infer<typeof ViolationEventModel>
