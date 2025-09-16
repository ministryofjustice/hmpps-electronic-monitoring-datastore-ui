import z from 'zod'

export type IntegrityIncidentEventDetails = z.infer<typeof IntegrityIncidentEventDetails>
export const IntegrityIncidentEventDetails = z.object({
  type: z.string().nullish(),
})

export type IntegrityIncidentEvent = z.infer<typeof IntegrityIncidentEvent>
export const IntegrityIncidentEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: IntegrityIncidentEventDetails,
})
