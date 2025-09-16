import z from 'zod'

export type AlcoholMonitoringContactEventDetails = z.infer<typeof AlcoholMonitoringContactEventDetails>
export const AlcoholMonitoringContactEventDetails = z.object({
  contactDateTime: z.string().nullish(),
  inboundOrOutbound: z.string().nullish(),
  fromTo: z.string().nullish(),
  channel: z.string().nullish(),
  subjectConsentWithdrawn: z.string().nullish(),
  callOutcome: z.string().nullish(),
  statement: z.string().nullish(),
  reasonForContact: z.string().nullish(),
  outcomeOfContact: z.string().nullish(),
  visitRequired: z.string().nullish(),
  visitId: z.string().nullish(),
})

export type AlcoholMonitoringContactEvent = z.infer<typeof AlcoholMonitoringContactEvent>
export const AlcoholMonitoringContactEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: AlcoholMonitoringContactEventDetails,
})
