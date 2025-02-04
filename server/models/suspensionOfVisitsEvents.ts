import z from 'zod'

export const SuspensionOfVisitsEventModel = z.object({
  legacyOrderId: z.number(),
  legacySubjectId: z.number(),
  suspensionOfVisits: z.string(),
  requestedDate: z.date(),
  startDate: z.string().optional(),
  endDate: z.string(),
})

export const SuspensionOfVisitsEventsModel = z.object({
  pageSize: z.number().default(0),
  events: z.array(SuspensionOfVisitsEventModel).default([]),
})

export type SuspensionOfVisitsEvent = z.infer<typeof SuspensionOfVisitsEventModel>
export type SuspensionOfVisitsEvents = z.infer<typeof SuspensionOfVisitsEventsModel>

export default SuspensionOfVisitsEventModel
