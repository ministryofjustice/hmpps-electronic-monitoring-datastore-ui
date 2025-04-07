import z from 'zod'

export const AlcoholMonitoringOrderDetailsModel = z.object({
  legacyOrderId: z.string(),
  legacySubjectId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  alias: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  sex: z.string().nullable(),
  specialInstructions: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  address3: z.string().nullable(),
  postcode: z.string().nullable(),
  orderStartDate: z.string().nullable(),
  orderEndDate: z.string().nullable(),
  enforceableCondition: z.string().nullable(),
  orderType: z.string().nullable(),
  orderTypeDescription: z.string().nullable(),
  orderEndOutcome: z.string().nullable(),
  responsibleOrganisationPhoneNumber: z.string().nullable(),
  responsibleOrganisationEmail: z.string().nullable(),
  tagAtSource: z.string().nullable(),
})

export type AlcoholMonitoringOrderDetails = z.infer<typeof AlcoholMonitoringOrderDetailsModel>
