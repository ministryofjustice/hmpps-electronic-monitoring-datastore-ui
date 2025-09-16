import z from 'zod'

export type IntegrityMonitoringEventDetails = z.infer<typeof IntegrityMonitoringEventDetails>
export const IntegrityMonitoringEventDetails = z.object({
  type: z.string().nullish(),
  processedDateTime: z.string().nullish(),
})

export type IntegrityMonitoringEvent = z.infer<typeof IntegrityMonitoringEvent>
export const IntegrityMonitoringEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: IntegrityMonitoringEventDetails,
})
