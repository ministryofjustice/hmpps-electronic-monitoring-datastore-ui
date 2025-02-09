import z from 'zod'

export const ContactEventModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  type: z.string(),
  dateTime: z.string(),
  details: z.object({}).passthrough(),
})

export type ContactEvent = z.infer<typeof ContactEventModel>
