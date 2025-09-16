import z from 'zod'

export type AlcoholMonitoringIncidentEventDetails = z.infer<typeof AlcoholMonitoringIncidentEventDetails>
export const AlcoholMonitoringIncidentEventDetails = z.object({
  violationAlertId: z.string().nullish(),
  violationAlertDateTime: z.string().nullish(),
  violationAlertType: z.string().nullish(),
  violationAlertResponseAction: z.string().nullish(),
  visitRequired: z.string().nullish(),
  probationInteractionRequired: z.string().nullish(),
  amsInteractionRequired: z.string().nullish(),
  multipleAlerts: z.string().nullish(),
  additionalAlerts: z.string().nullish(),
})

export type AlcoholMonitoringIncidentEvent = z.infer<typeof AlcoholMonitoringIncidentEvent>
export const AlcoholMonitoringIncidentEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: AlcoholMonitoringIncidentEventDetails,
})
