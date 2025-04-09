import z from 'zod'

export const OrderDetailsModel = z.object({
  specials: z.string(),
  legacySubjectId: z.number(),
  legacyOrderId: z.number(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  alias: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  adultOrChild: z.string().nullable(),
  sex: z.string().nullable(),
  contact: z.string().nullable(),
  primaryAddressLine1: z.string().nullable(),
  primaryAddressLine2: z.string().nullable(),
  primaryAddressLine3: z.string().nullable(),
  primaryAddressPostCode: z.string().nullable(),
  phoneOrMobileNumber: z.string().nullable(),
  ppo: z.string().nullable(),
  mappa: z.string().nullable(),
  technicalBail: z.string().nullable(),
  manualRisk: z.string().nullable(),
  offenceRisk: z.boolean(),
  postCodeRisk: z.string().nullable(),
  falseLimbRisk: z.string().nullable(),
  migratedRisk: z.string().nullable(),
  rangeRisk: z.string().nullable(),
  reportRisk: z.string().nullable(),

  orderStartDate: z.string().nullable(),
  orderEndDate: z.string().nullable(),
  orderType: z.string().nullable(),
  orderTypeDescription: z.string().nullable(),
  orderTypeDetail: z.string().nullable(),
  wearingWristPid: z.string().nullable(),
  notifyingOrganisationDetailsName: z.string().nullable(),
  responsibleOrganisation: z.string().nullable(),
  responsibleOrganisationDetailsRegion: z.string().nullable(),
})

export type OrderDetails = z.infer<typeof OrderDetailsModel>

export default OrderDetailsModel
