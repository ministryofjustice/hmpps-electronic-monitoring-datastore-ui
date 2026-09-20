import z from 'zod'

export type AlcoholMonitoringVisitDetails = z.infer<typeof AlcoholMonitoringVisitDetails>
export const AlcoholMonitoringVisitDetails = z.object({
  legacySubjectId: z.string(),
  visitId: z.string().optional(),
  visitType: z.string().optional(),
  visitAttempt: z.string().optional(),
  dateVisitRaised: z.string().optional(),
  visitAddress: z.string().optional(),
  visitNotes: z.string().optional(),
  visitOutcome: z.string().optional(),
  actualWorkStartDateTime: z.string().optional(),
  actualWorkEndDateTime: z.string().optional(),
  visitRejectionReason: z.string().optional(),
  visitRejectionDescription: z.string().optional(),
  visitCancelReason: z.string().optional(),
  visitCancelDescription: z.string().optional(),
})
