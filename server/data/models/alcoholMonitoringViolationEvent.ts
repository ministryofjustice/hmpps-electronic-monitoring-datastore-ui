import z from 'zod'

export type AlcoholMonitoringViolationEventDetails = z.infer<typeof AlcoholMonitoringViolationEventDetails>
export const AlcoholMonitoringViolationEventDetails = z.object({
  enforcementId: z.string().nullish(),
  nonComplianceReason: z.string().nullish(),
  nonComplianceDateTime: z.string().nullish(),
  violationAlertId: z.string().nullish(),
  violationAlertDescription: z.string().nullish(),
  violationEventNotificationDateTime: z.string().nullish(),
  actionTakenEms: z.string().nullish(),
  nonComplianceOutcome: z.string().nullish(),
  nonComplianceResolved: z.string().nullish(),
  dateResolved: z.string().nullish(),
  openClosed: z.string().nullish(),
  visitRequired: z.string().nullish(),
})

export type AlcoholMonitoringViolationEvent = z.infer<typeof AlcoholMonitoringViolationEvent>
export const AlcoholMonitoringViolationEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: AlcoholMonitoringViolationEventDetails,
})
