import { AlcoholMonitoringOrderDetails } from '../../alcoholMonitoring/orderDetails'

export type AlcoholMonitoringDeviceWearer = {
  legacySubjectId: string
  firstName?: string
  lastName?: string
  alias?: string
  legacySex?: string
  dateOfBirth?: string
  primaryAddressLine1?: string
  primaryAddressLine2?: string
  primaryAddressLine3?: string
  primaryAddressPostcode?: string
  phoneOrMobileNumber?: string
}

export type AlcoholMonitoringOrder = {
  orderStartDate?: string
  orderEndDate?: string
  orderType?: string
  orderTypeDescription?: string
  orderEndOutcome?: string
  specialInstructions?: string
  enforceableCondition?: string
  tagAtSource?: string
  responsibleOrganisationPhoneNumber?: string
  responsibleOrganisationEmail?: string
}

export type AlcoholMonitoringOrderDetailsViewModel = {
  legacySubjectId: string
  deviceWearerDetails: AlcoholMonitoringDeviceWearer
  orderDetails: AlcoholMonitoringOrder
  backUrl: string
}

const createViewModelFromApiDto = (
  legacySubjectId: string,
  backUrl: string,
  orderDetails: AlcoholMonitoringOrderDetails,
): AlcoholMonitoringOrderDetailsViewModel => ({
  legacySubjectId,
  deviceWearerDetails: {
    legacySubjectId: orderDetails.legacySubjectId,
    firstName: orderDetails.firstName,
    lastName: orderDetails.lastName,
    alias: orderDetails.alias,
    legacySex: orderDetails.sex,
    dateOfBirth: orderDetails.dateOfBirth,
    primaryAddressLine1: orderDetails.address1,
    primaryAddressLine2: orderDetails.address2,
    primaryAddressLine3: orderDetails.address3,
    primaryAddressPostcode: orderDetails.postcode,
    phoneOrMobileNumber: orderDetails.phoneNumber,
  },
  orderDetails: {
    orderStartDate: orderDetails.orderStartDate,
    orderEndDate: orderDetails.orderEndDate,
    orderType: orderDetails.orderType,
    orderTypeDescription: orderDetails.orderTypeDescription,
    orderEndOutcome: orderDetails.orderEndOutcome,
    specialInstructions: orderDetails.specialInstructions,
    enforceableCondition: orderDetails.enforceableCondition,
    tagAtSource: orderDetails.tagAtSource,
    responsibleOrganisationPhoneNumber: orderDetails.responsibleOrganisationPhoneNumber,
    responsibleOrganisationEmail: orderDetails.responsibleOrganisationEmail,
  },
  backUrl,
})

const construct = (
  legacySubjectId: string,
  backUrl: string,
  orderDetails: AlcoholMonitoringOrderDetails = {},
): AlcoholMonitoringOrderDetailsViewModel => {
  return createViewModelFromApiDto(legacySubjectId, backUrl, orderDetails)
}

export default {
  construct,
}
