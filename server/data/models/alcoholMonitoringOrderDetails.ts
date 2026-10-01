import z from 'zod'

export type AlcoholMonitoringOrderDetails = z.infer<typeof AlcoholMonitoringOrderDetails>
export const AlcoholMonitoringOrderDetails = z.object({
  legacySubjectId: z.string(),
  legacyOrderId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  alias: z.string().optional(),
  dateOfBirth: z.string().optional(),
  sex: z.string().optional(),
  specialInstructions: z.string().optional(),
  phoneNumber: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  address3: z.string().optional(),
  postcode: z.string().optional(),
  orderStartDate: z.string().optional(),
  orderEndDate: z.string().optional(),
  enforceableCondition: z.string().optional(),
  orderType: z.string().optional(),
  orderTypeDescription: z.string().optional(),
  orderEndOutcome: z.string().optional(),
  responsibleOrganisationPhoneNumber: z.string().optional(),
  responsibleOrganisationEmail: z.string().optional(),
  tagAtSource: z.string().optional(),
})
