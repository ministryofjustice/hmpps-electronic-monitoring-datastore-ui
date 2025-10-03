import paths from '../../constants/paths'
import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'
import { buildUrl } from '../../utils/utils'

export type AlcoholMonitoringDeviceWearer = {
  legacySubjectId: string
  firstName?: string
  lastName?: string
  alias?: string
  legacySex?: string
  dateOfBirth?: string
  primaryAddress?: string[]
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

export type AlcoholMonitoringOrderDetailsView = {
  legacySubjectId: string
  deviceWearerDetails: AlcoholMonitoringDeviceWearer
  orderDetails: AlcoholMonitoringOrder
  backUrl: string
}

export const AlcoholMonitoringOrderDetailsView = {
  construct(legacySubjectId: string, orderDetails: AlcoholMonitoringOrderDetails): AlcoholMonitoringOrderDetailsView {
    return {
      legacySubjectId,
      deviceWearerDetails: {
        legacySubjectId: orderDetails.legacySubjectId,
        firstName: orderDetails.firstName,
        lastName: orderDetails.lastName,
        alias: orderDetails.alias,
        legacySex: orderDetails.sex,
        dateOfBirth: orderDetails.dateOfBirth,
        primaryAddress: [
          orderDetails.address1,
          orderDetails.address2,
          orderDetails.address3,
          orderDetails.postcode,
        ].filter(n => n && n !== ''),
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
      backUrl: buildUrl(paths.ALCOHOL_MONITORING.SUMMARY, { legacySubjectId }),
    }
  },
}
