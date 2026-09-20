import { paths } from '../../constants/paths'
import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'
import { buildUrl } from '../../utils/utils'

export type AlcoholMonitoringDeviceWearer = {
  legacySubjectId: string
  firstName?: string | null
  lastName?: string | null
  alias?: string | null
  legacySex?: string | null
  dateOfBirth?: string | null
  primaryAddress?: (string | null | undefined)[]
  phoneOrMobileNumber?: string | null
}

export type AlcoholMonitoringOrder = {
  orderStartDate?: string | null
  orderEndDate?: string | null
  orderType?: string | null
  orderTypeDescription?: string | null
  orderEndOutcome?: string | null
  specialInstructions?: string | null
  enforceableCondition?: string | null
  tagAtSource?: string | null
  responsibleOrganisationPhoneNumber?: string | null
  responsibleOrganisationEmail?: string | null
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
