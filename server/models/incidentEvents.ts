import z from 'zod'

export const IncidentEventModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  type: z.string(),
  dateTime: z.string(),
  details: z.object({}).passthrough(),
})

export const IncidentEventsModel = z.object({
  pageSize: z.number().default(0),
  events: z.array(IncidentEventModel).default([]),
})

export type IncidentEvent = z.infer<typeof IncidentEventModel>
export type IncidentEvents = z.infer<typeof IncidentEventsModel>

export default IncidentEventModel
