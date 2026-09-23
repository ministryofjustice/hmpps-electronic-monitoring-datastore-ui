import z from 'zod'

export type AlcoholMonitoringIncidentEventDetails = z.infer<typeof AlcoholMonitoringIncidentEventDetails>
export const AlcoholMonitoringIncidentEventDetails = z.object({
  violationAlertId: z.string().optional(),
  violationAlertDateTime: z.string().optional(),
  violationAlertType: z.string().optional(),
  violationAlertResponseAction: z.string().optional(),
  visitRequired: z.string().optional(),
  probationInteractionRequired: z.string().optional(),
  amsInteractionRequired: z.string().optional(),
  multipleAlerts: z.string().optional(),
  additionalAlerts: z.string().optional(),
})

export type AlcoholMonitoringIncidentEvent = z.infer<typeof AlcoholMonitoringIncidentEvent>
export const AlcoholMonitoringIncidentEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: AlcoholMonitoringIncidentEventDetails,
})
