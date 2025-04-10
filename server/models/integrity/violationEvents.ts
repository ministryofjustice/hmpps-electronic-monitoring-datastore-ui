import z from 'zod'

export const IntegrityViolationEventDetailsModel = z.object({
  type: z.string().nullable(),
  enforcementReason: z.string().nullable(),
  investigationOutcomeReason: z.string().nullable(),
  breachDetails: z.string().nullable(),
  breachEnforcementOutcome: z.string().nullable(),
  agencyAction: z.string().nullable(),
  breachDateTime: z.string().nullable(),
  breachIdentifiedDateTime: z.string().nullable(),
  authorityFirstNotifiedDateTime: z.string().nullable(),
  agencyResponseDate: z.string().nullable(),
  breachPackRequestedDate: z.string().nullable(),
  breachPackSentDate: z.string().nullable(),
  section9Date: z.string().nullable(),
  hearingDate: z.string().nullable(),
  summonsServedDate: z.string().nullable(),
  subjectLetterSentDate: z.string().nullable(),
  warningLetterSentDateTime: z.string().nullable(),
})

export const IntegrityViolationEventModel = z.object({
  legacySubjectId: z.number(),
  type: z.string(),
  dateTime: z.string(),
  details: z.object({}).passthrough(),
})

export type IntegrityViolationEventDetails = z.infer<typeof IntegrityViolationEventDetailsModel>
export type IntegrityViolationEvent = z.infer<typeof IntegrityViolationEventModel>
