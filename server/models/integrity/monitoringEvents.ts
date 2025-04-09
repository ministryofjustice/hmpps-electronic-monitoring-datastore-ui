import z from 'zod'

export const IntegrityMonitoringEventDetailsModel = z.object({
  type: z.string().nullable(),
  processedDateTime: z.string().nullable(),
})

export const IntegrityMonitoringEventModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  type: z.string(),
  dateTime: z.string(),
  details: z.object({}).passthrough(),
})

export type IntegrityMonitoringEventDetails = z.infer<typeof IntegrityMonitoringEventDetailsModel>
export type IntegrityMonitoringEvent = z.infer<typeof IntegrityMonitoringEventModel>
