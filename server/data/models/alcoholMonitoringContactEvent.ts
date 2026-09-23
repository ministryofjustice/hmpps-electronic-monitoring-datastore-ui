import z from 'zod'

export type AlcoholMonitoringContactEventDetails = z.infer<typeof AlcoholMonitoringContactEventDetails>
export const AlcoholMonitoringContactEventDetails = z.object({
  contactDateTime: z.string().optional(),
  inboundOrOutbound: z.string().optional(),
  fromTo: z.string().optional(),
  channel: z.string().optional(),
  subjectConsentWithdrawn: z.string().optional(),
  callOutcome: z.string().optional(),
  statement: z.string().optional(),
  reasonForContact: z.string().optional(),
  outcomeOfContact: z.string().optional(),
  visitRequired: z.string().optional(),
  visitId: z.string().optional(),
})

export type AlcoholMonitoringContactEvent = z.infer<typeof AlcoholMonitoringContactEvent>
export const AlcoholMonitoringContactEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: AlcoholMonitoringContactEventDetails,
})
