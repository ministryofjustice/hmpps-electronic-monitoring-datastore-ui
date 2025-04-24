import z from 'zod'

export const IntegrityKeyOrderInformationModel = z.object({
  specials: z.string().nullable(),
  legacySubjectId: z.string(),
  name: z.string().nullable(),
  alias: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  postcode: z.string().nullable(),
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  address3: z.string().nullable(),
  orderStartDate: z.string().nullable(),
  orderEndDate: z.string().nullable(),
})

export const IntegritySubjectHistoryReportModel = z.object({
  reportUrl: z.string().nullable(),
  name: z.string().nullable(),
  createdOn: z.string().nullable(),
  time: z.string().nullable(),
})

export const IntegrityOrderDocumentModel = z.object({
  name: z.string().nullable(),
  url: z.string().nullable(),
  createdOn: z.string().nullable(),
  time: z.string().nullable(),
  notes: z.string().nullable(),
})

export const IntegrityReportsModel = z.object({
  orderDetails: z.boolean(),
  visitDetails: z.boolean(),
  // visitsAndTasks: z.boolean(),
  // eventHistory: z.boolean(),
  equipmentDetails: z.boolean(),
  // curfewHours: z.boolean(),
  // curfewViolations: z.boolean(),
  // contactHistory: z.boolean(),
  // suspensions: z.boolean(),
  suspensionOfVisits: z.boolean(),
  allEventHistory: z.boolean(),
  services: z.boolean(),
})

export const IntegrityOrderSummaryModel = z.object({
  keyOrderInformation: IntegrityKeyOrderInformationModel.optional(),
  subjectHistoryReport: IntegritySubjectHistoryReportModel.optional(),
  documents: z.array(IntegrityOrderDocumentModel).optional(),
})

export type IntegrityKeyOrderInformation = z.infer<typeof IntegrityKeyOrderInformationModel>
export type IntegritySubjectHistoryReport = z.infer<typeof IntegritySubjectHistoryReportModel>
export type IntegrityOrderDocument = z.infer<typeof IntegrityOrderDocumentModel>
export type IntegrityReports = z.infer<typeof IntegrityReportsModel>
export type IntegrityOrderSummary = z.infer<typeof IntegrityOrderSummaryModel>
