import z from 'zod'

export const AlcoholMonitoringViolationEventDetailsModel = z.object({
  enforcementId: z.string().nullable(),
  nonComplianceReason: z.string().nullable(),
  nonComplianceDateTime: z.string().nullable(),
  violationAlertId: z.string().nullable(),
  violationAlertDescription: z.string().nullable(),
  violationEventNotificationDateTime: z.string().nullable(),
  actionTakenEms: z.string().nullable(),
  nonComplianceOutcome: z.string().nullable(),
  nonComplianceResolved: z.string().nullable(),
  dateResolved: z.string().nullable(),
  openClosed: z.string().nullable(),
  visitRequired: z.string().nullable(),
})

export const AlcoholMonitoringViolationEventModel = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: AlcoholMonitoringViolationEventDetailsModel,
})

export type AlcoholMonitoringViolationEventDetails = z.infer<typeof AlcoholMonitoringViolationEventDetailsModel>
export type AlcoholMonitoringViolationEvent = z.infer<typeof AlcoholMonitoringViolationEventModel>
