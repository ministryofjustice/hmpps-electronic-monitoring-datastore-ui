import z from 'zod'

export type IntegrityContactEventDetails = z.infer<typeof IntegrityContactEventDetails>
export const IntegrityContactEventDetails = z.object({
  outcome: z.string().nullish(),
  type: z.string().nullish(),
  reason: z.string().nullish(),
  channel: z.string().nullish(),
  userId: z.string().nullish(),
  userName: z.string().nullish(),
  modifiedDateTime: z.string().nullish(),
})

export type IntegrityContactEvent = z.infer<typeof IntegrityContactEvent>
export const IntegrityContactEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: IntegrityContactEventDetails,
})
