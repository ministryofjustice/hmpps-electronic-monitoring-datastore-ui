import z from 'zod'

const orderDetails = z.object({
  specials: z.string(),
  legacySubjectId: z.string(),
  legacyOrderId: z.string(),
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

const formatOrderDetails = orderDetails.transform(data => {
  return {
    deviceWearerData: [
      {
        key: 'Specials',
        value: data.specials,
      },
      {
        key: 'Legacy subject ID',
        value: data.legacySubjectId,
      },
      {
        key: 'Legacy order ID',
        value: data.legacyOrderId,
      },
      {
        key: 'First name',
        value: data.firstName,
      },
      {
        key: 'Last name',
        value: data.lastName,
      },
      {
        key: 'Alias',
        value: data.alias,
      },
      {
        key: 'Date of birth',
        value: data.dateOfBirth,
      },
      {
        key: 'Adult/child',
        value: data.adultOrChild,
      },
      {
        key: 'Legacy sex',
        value: data.sex,
      },
      {
        key: 'Contact',
        value: data.contact,
      },
      {
        key: 'Primary address',
        html: `${data.primaryAddressLine1 ? `${data.primaryAddressLine1}<br>` : ''}
        ${data.primaryAddressLine2 ? `${data.primaryAddressLine2}<br>` : ''}
        ${data.primaryAddressLine3 ? `${data.primaryAddressLine3}<br>` : ''}
        ${data.primaryAddressPostCode || ''}`,
      },
      {
        key: 'Phone/mobile number',
        value: data.phoneOrMobileNumber,
      },
      {
        key: 'PPO',
        value: data.ppo,
      },
      {
        key: 'MAPPA',
        value: data.mappa,
      },
      {
        key: 'Technical bail',
        value: data.technicalBail,
      },
      {
        key: 'Manual risk',
        value: data.manualRisk,
      },
      {
        key: 'Offence risk',
        value: data.offenceRisk ? 'Yes' : 'No',
      },
      {
        key: 'Postcode risk',
        value: data.postCodeRisk,
      },
      {
        key: 'False limb risk',
        value: data.falseLimbRisk,
      },
      {
        key: 'Migrated risk',
        value: data.migratedRisk,
      },
      {
        key: 'Range risk',
        value: data.rangeRisk,
      },
      {
        key: 'Report risk',
        value: data.reportRisk,
      },
    ],
    orderData: [
      {
        key: 'Order start date',
        value: data.orderStartDate,
      },
      {
        key: 'Order end date',
        value: data.orderEndDate,
      },
      {
        key: 'Order type',
        value: data.orderType,
      },
      {
        key: 'Order type description',
        value: data.orderTypeDescription,
      },
      {
        key: 'Order type detail',
        value: data.orderTypeDetail,
      },
      {
        key: 'Wearing wrist PID',
        value: data.wearingWristPid,
      },
      {
        key: 'Notifying organisation name',
        value: data.notifyingOrganisationDetailsName,
      },
      {
        key: 'Responsible organisation',
        value: data.responsibleOrganisation,
      },
      {
        key: 'Responsible organisation region',
        value: data.responsibleOrganisationDetailsRegion,
      },
    ],
  }
})

export { orderDetails, formatOrderDetails }
