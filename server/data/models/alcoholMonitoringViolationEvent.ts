import z from 'zod'

export type AlcoholMonitoringViolationEventDetails = z.infer<typeof AlcoholMonitoringViolationEventDetails>
export const AlcoholMonitoringViolationEventDetails = z.object({
  enforcementId: z.string().optional(),
  nonComplianceReason: z.string().optional(),
  nonComplianceDateTime: z.string().optional(),
  violationAlertId: z.string().optional(),
  violationAlertDescription: z.string().optional(),
  violationEventNotificationDateTime: z.string().optional(),
  actionTakenEms: z.string().optional(),
  nonComplianceOutcome: z.string().optional(),
  nonComplianceResolved: z.string().optional(),
  dateResolved: z.string().optional(),
  openClosed: z.string().optional(),
  visitRequired: z.string().optional(),
})

export type AlcoholMonitoringViolationEvent = z.infer<typeof AlcoholMonitoringViolationEvent>
export const AlcoholMonitoringViolationEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: AlcoholMonitoringViolationEventDetails,
})
