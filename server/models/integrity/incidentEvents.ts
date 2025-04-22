import z from 'zod'

export const IntegrityIncidentEventDetailsModel = z.object({
  type: z.string().nullable(),
})

export const IntegrityIncidentEventModel = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: z.object({}).passthrough(),
})

export type IntegrityIncidentEventDetails = z.infer<typeof IntegrityIncidentEventDetailsModel>
export type IntegrityIncidentEvent = z.infer<typeof IntegrityIncidentEventModel>
