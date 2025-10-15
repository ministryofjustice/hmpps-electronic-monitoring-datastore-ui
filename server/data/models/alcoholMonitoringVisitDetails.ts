import z from 'zod'

export type AlcoholMonitoringVisitDetails = z.infer<typeof AlcoholMonitoringVisitDetails>
export const AlcoholMonitoringVisitDetails = z.object({
  legacySubjectId: z.string(),
  visitId: z.string().nullish(),
  visitType: z.string().nullish(),
  visitAttempt: z.string().nullish(),
  dateVisitRaised: z.string().nullish(),
  visitAddress: z.string().nullish(),
  visitNotes: z.string().nullish(),
  visitOutcome: z.string().nullish(),
  actualWorkStartDateTime: z.string().nullish(),
  actualWorkEndDateTime: z.string().nullish(),
  visitRejectionReason: z.string().nullish(),
  visitRejectionDescription: z.string().nullish(),
  visitCancelReason: z.string().nullish(),
  visitCancelDescription: z.string().nullish(),
})
