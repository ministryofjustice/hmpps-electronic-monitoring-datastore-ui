import z from 'zod'

export const IntegrityMonitoringEventDetailsModel = z.object({
  type: z.string().nullable(),
  processedDateTime: z.string().nullable(),
})

export const IntegrityMonitoringEventModel = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: z.object({}).passthrough(),
})

export type IntegrityMonitoringEventDetails = z.infer<typeof IntegrityMonitoringEventDetailsModel>
export type IntegrityMonitoringEvent = z.infer<typeof IntegrityMonitoringEventModel>
