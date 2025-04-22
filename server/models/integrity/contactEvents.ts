import z from 'zod'

export const IntegrityContactEventDetailsModel = z.object({
  outcome: z.string().nullable(),
  type: z.string().nullable(),
  reason: z.string().nullable(),
  channel: z.string().nullable(),
  userId: z.string().nullable(),
  userName: z.string().nullable(),
  modifiedDateTime: z.string().nullable(),
})

export const IntegrityContactEventModel = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: IntegrityContactEventDetailsModel,
})

export type IntegrityContactEventDetails = z.infer<typeof IntegrityContactEventDetailsModel>
export type IntegrityContactEvent = z.infer<typeof IntegrityContactEventModel>

export default IntegrityContactEventModel
