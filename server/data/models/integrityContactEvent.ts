import z from 'zod'

export type IntegrityContactEventDetails = z.infer<typeof IntegrityContactEventDetails>
export const IntegrityContactEventDetails = z.object({
  outcome: z.string().optional(),
  type: z.string().optional(),
  reason: z.string().optional(),
  channel: z.string().optional(),
  userId: z.string().optional(),
  userName: z.string().optional(),
  modifiedDateTime: z.string().optional(),
})

export type IntegrityContactEvent = z.infer<typeof IntegrityContactEvent>
export const IntegrityContactEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: IntegrityContactEventDetails,
})
