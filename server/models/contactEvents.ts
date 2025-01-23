import z from 'zod'

export const ContactEventModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  type: z.string(),
  dateTime: z.string(),
  details: z.object({}).passthrough(),
})

export const ContactEventsModel = z.object({
  pageSize: z.number().default(0),
  events: z.array(ContactEventModel).default([]),
})

export type ContactEvent = z.infer<typeof ContactEventModel>
export type ContactEvents = z.infer<typeof ContactEventsModel>

export default ContactEventModel
