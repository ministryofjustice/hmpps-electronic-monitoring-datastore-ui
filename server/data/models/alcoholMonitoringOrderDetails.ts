import z from 'zod'

export type AlcoholMonitoringOrderDetails = z.infer<typeof AlcoholMonitoringOrderDetails>
export const AlcoholMonitoringOrderDetails = z.object({
  legacySubjectId: z.string(),
  legacyOrderId: z.string().nullish(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  alias: z.string().nullish(),
  dateOfBirth: z.string().nullish(),
  sex: z.string().nullish(),
  specialInstructions: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  address1: z.string().nullish(),
  address2: z.string().nullish(),
  address3: z.string().nullish(),
  postcode: z.string().nullish(),
  orderStartDate: z.string().nullish(),
  orderEndDate: z.string().nullish(),
  enforceableCondition: z.string().nullish(),
  orderType: z.string().nullish(),
  orderTypeDescription: z.string().nullish(),
  orderEndOutcome: z.string().nullish(),
  responsibleOrganisationPhoneNumber: z.string().nullish(),
  responsibleOrganisationEmail: z.string().nullish(),
  tagAtSource: z.string().nullish(),
})
