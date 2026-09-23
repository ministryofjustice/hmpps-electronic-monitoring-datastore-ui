import z from 'zod'

export type IntegrityViolationEventDetails = z.infer<typeof IntegrityViolationEventDetails>
export const IntegrityViolationEventDetails = z.object({
  enforcementReason: z.string().optional(),
  investigationOutcomeReason: z.string().optional(),
  breachDetails: z.string().optional(),
  breachEnforcementOutcome: z.string().optional(),
  agencyAction: z.string().optional(),
  breachDateTime: z.string().optional(),
  breachIdentifiedDateTime: z.string().optional(),
  authorityFirstNotifiedDateTime: z.string().optional(),
  agencyResponseDate: z.string().optional(),
  breachPackRequestedDate: z.string().optional(),
  breachPackSentDate: z.string().optional(),
  section9Date: z.string().optional(),
  hearingDate: z.string().optional(),
  summonsServedDate: z.string().optional(),
  subjectLetterSentDate: z.string().optional(),
  warningLetterSentDateTime: z.string().optional(),
})

export type IntegrityViolationEvent = z.infer<typeof IntegrityViolationEvent>
export const IntegrityViolationEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: IntegrityViolationEventDetails,
})
