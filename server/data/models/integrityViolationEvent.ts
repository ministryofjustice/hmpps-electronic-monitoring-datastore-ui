import z from 'zod'

export type IntegrityViolationEventDetails = z.infer<typeof IntegrityViolationEventDetails>
export const IntegrityViolationEventDetails = z.object({
  enforcementReason: z.string().nullish(),
  investigationOutcomeReason: z.string().nullish(),
  breachDetails: z.string().nullish(),
  breachEnforcementOutcome: z.string().nullish(),
  agencyAction: z.string().nullish(),
  breachDateTime: z.string().nullish(),
  breachIdentifiedDateTime: z.string().nullish(),
  authorityFirstNotifiedDateTime: z.string().nullish(),
  agencyResponseDate: z.string().nullish(),
  breachPackRequestedDate: z.string().nullish(),
  breachPackSentDate: z.string().nullish(),
  section9Date: z.string().nullish(),
  hearingDate: z.string().nullish(),
  summonsServedDate: z.string().nullish(),
  subjectLetterSentDate: z.string().nullish(),
  warningLetterSentDateTime: z.string().nullish(),
})

export type IntegrityViolationEvent = z.infer<typeof IntegrityViolationEvent>
export const IntegrityViolationEvent = z.object({
  legacySubjectId: z.string(),
  type: z.string(),
  dateTime: z.string(),
  details: IntegrityViolationEventDetails,
})
