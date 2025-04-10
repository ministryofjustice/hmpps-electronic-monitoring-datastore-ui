import z from 'zod'

export const AlcoholMonitoringIncidentEventDetailsModel = z.object({
  violationAlertId: z.string().nullable(),
  violationAlertDateTime: z.string().nullable(),
  violationAlertType: z.string().nullable(),
  violationAlertResponseAction: z.string().nullable(),
  visitRequired: z.string().nullable(),
  probationInteractionRequired: z.string().nullable(),
  amsInteractionRequired: z.string().nullable(),
  multipleAlerts: z.string().nullable(),
  additionalAlerts: z.string().nullable(),
})

export const AlcoholMonitoringIncidentEventModel = z.object({
  legacySubjectId: z.number(),
  type: z.string(),
  dateTime: z.string(),
  details: AlcoholMonitoringIncidentEventDetailsModel,
})

export type AlcoholMonitoringIncidentEventDetails = z.infer<typeof AlcoholMonitoringIncidentEventDetailsModel>
export type AlcoholMonitoringIncidentEvent = z.infer<typeof AlcoholMonitoringIncidentEventModel>
