import z from 'zod'

export const AlcoholMonitoringContactEventDetailsModel = z.object({
  contactDateTime: z.string().nullable(),
  inboundOrOutbound: z.string().nullable(),
  fromTo: z.string().nullable(),
  channel: z.string().nullable(),
  subjectConsentWithdrawn: z.string().nullable(),
  callOutcome: z.string().nullable(),
  statement: z.string().nullable(),
  reasonForContact: z.string().nullable(),
  outcomeOfContact: z.string().nullable(),
  visitRequired: z.string().nullable(),
  visitId: z.string().nullable(),
})

export const AlcoholMonitoringContactEventModel = z.object({
  legacySubjectId: z.number(),
  type: z.string(),
  dateTime: z.string(),
  details: AlcoholMonitoringContactEventDetailsModel,
})

export type AlcoholMonitoringContactEventDetails = z.infer<typeof AlcoholMonitoringContactEventDetailsModel>
export type AlcoholMonitoringContactEvent = z.infer<typeof AlcoholMonitoringContactEventModel>

export default AlcoholMonitoringContactEventModel
