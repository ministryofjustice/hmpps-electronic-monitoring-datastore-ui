import z from 'zod'

export const KeyOrderInformationModel = z.object({
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

export const SubjectHistoryReportModel = z.object({
  reportUrl: z.string().nullable(),
  name: z.string().nullable(),
  createdOn: z.string().nullable(),
  time: z.string().nullable(),
})

export const OrderDocumentModel = z.object({
  name: z.string().nullable(),
  url: z.string().nullable(),
  createdOn: z.string().nullable(),
  time: z.string().nullable(),
  notes: z.string().nullable(),
})

export const OrderDocumentListModel = z.object({
  pageSize: z.number().nullable(),
  orderDocuments: z.array(OrderDocumentModel).nullable(),
})

export const ReportsModel = z.object({
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
  keyOrderInformation: KeyOrderInformationModel.nullable(),
  subjectHistoryReport: SubjectHistoryReportModel.nullable(),
  documents: OrderDocumentListModel.nullable(),
})

export type KeyOrderInformation = z.infer<typeof KeyOrderInformationModel>
export type SubjectHistoryReport = z.infer<typeof SubjectHistoryReportModel>
export type OrderDocument = z.infer<typeof OrderDocumentModel>
export type OrderDocumentList = z.infer<typeof OrderDocumentListModel>
export type Reports = z.infer<typeof ReportsModel>
export type IntegrityOrderSummary = z.infer<typeof IntegrityOrderSummaryModel>
