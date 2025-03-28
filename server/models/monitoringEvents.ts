import z from 'zod'

export const MonitoringEventModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  type: z.string(),
  dateTime: z.string(),
  details: z.object({}).passthrough(),
})

export const MonitoringEventsModel = z.object({
  pageSize: z.number().default(0),
  events: z.array(MonitoringEventModel).default([]),
})

export type MonitoringEvent = z.infer<typeof MonitoringEventModel>
export type MonitoringEvents = z.infer<typeof MonitoringEventsModel>

export default MonitoringEventModel
