import z from 'zod'

export const AlcoholMonitoringVisitDetailsModel = z.object({
  legacyOrderId: z.string(),
  legacySubjectId: z.string(),
  visitId: z.string().nullable(),
  visitType: z.string().nullable(),
  visitAttempt: z.string().nullable(),
  dateVisitRaised: z.string().nullable(),
  visitAddress: z.string().nullable(),
  visitNotes: z.string().nullable(),
  visitOutcome: z.string().nullable(),
  actualWorkStartDateTime: z.string().nullable(),
  actualWorkEndDateTime: z.string().nullable(),
  visitRejectionReason: z.string().nullable(),
  visitRejectionDescription: z.string().nullable(),
  visitCancelReason: z.string().nullable(),
  visitCancelDescription: z.string().nullable(),
})

export type AlcoholMonitoringVisitDetails = z.infer<typeof AlcoholMonitoringVisitDetailsModel>
