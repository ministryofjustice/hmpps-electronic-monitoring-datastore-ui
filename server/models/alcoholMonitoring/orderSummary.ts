import z from 'zod'

export const AlcoholMonitoringOrderSummaryModel = z.object({
  legacyOrderId: z.string(),
  legacySubjectId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  alias: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  address3: z.string().nullable(),
  postcode: z.string().nullable(),
  orderStartDate: z.string().nullable(),
  orderEndDate: z.string().nullable(),
})

export type AlcoholMonitoringOrderSummary = z.infer<typeof AlcoholMonitoringOrderSummaryModel>
