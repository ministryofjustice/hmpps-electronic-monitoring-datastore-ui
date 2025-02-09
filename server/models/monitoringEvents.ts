import z from 'zod'

export const MonitoringEventModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  type: z.string(),
  dateTime: z.string(),
  details: z.object({}).passthrough(),
})

export type MonitoringEvent = z.infer<typeof MonitoringEventModel>
