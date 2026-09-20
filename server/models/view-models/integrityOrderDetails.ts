import { paths } from '../../constants/paths'
import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'
import { buildUrl } from '../../utils/utils'

export type IntegrityOrderDetailsView = {
  legacySubjectId: string
  deviceWearerDetails: {
    specials: string
    legacySubjectId: string
    firstName?: string | null
    lastName?: string | null
    alias?: string | null
    dateOfBirth?: string | null
    adultOrChild?: string | null
    sex?: string | null
    contact?: string | null
    primaryAddress?: (string | null | undefined)[]
    phoneOrMobileNumber?: string | null
    ppo?: string | null
    mappa?: string | null
    technicalBail?: string | null
    manualRisk?: string | null
    offenseRisk?: string | null
    postCodeRisk?: string | null
    falseLimbRisk?: string | null
    migratedRisk?: string | null
    rangeRisk?: string | null
    reportRisk?: string | null
  }
  orderDetails: {
    orderStartDate?: string | null
    orderEndDate?: string | null
    orderType?: string | null
    orderTypeDescription?: string | null
    orderTypeDetail?: string | null
    wearingWristPid?: string | null
    notifyingOrganisationDetailsName?: string | null
    responsibleOrganisation?: string | null
    responsibleOrganisationDetailsRegion?: string | null
  }
  backUrl: string
}

export const IntegrityOrderDetailsView = {
  construct(legacySubjectId: string, orderDetails: IntegrityOrderDetails): IntegrityOrderDetailsView {
    return {
      legacySubjectId,
      deviceWearerDetails: {
        legacySubjectId,
        firstName: orderDetails.firstName,
        lastName: orderDetails.lastName,
        specials: orderDetails.specials,
        alias: orderDetails.alias,
        dateOfBirth: orderDetails.dateOfBirth,
        adultOrChild: orderDetails.adultOrChild,
        sex: orderDetails.sex,
        contact: orderDetails.contact,
        primaryAddress: [
          orderDetails.primaryAddressLine1,
          orderDetails.primaryAddressLine2,
          orderDetails.primaryAddressLine3,
          orderDetails.primaryAddressPostCode,
        ].filter(n => n && n !== ''),
        phoneOrMobileNumber: orderDetails.phoneOrMobileNumber,
        ppo: orderDetails.ppo,
        mappa: orderDetails.mappa,
        technicalBail: orderDetails.technicalBail,
        manualRisk: orderDetails.manualRisk,
        offenseRisk: orderDetails.offenceRisk ? 'Yes' : 'No',
        postCodeRisk: orderDetails.postCodeRisk,
        falseLimbRisk: orderDetails.falseLimbRisk,
        migratedRisk: orderDetails.migratedRisk,
        rangeRisk: orderDetails.rangeRisk,
        reportRisk: orderDetails.reportRisk,
      },
      orderDetails: {
        orderStartDate: orderDetails.orderStartDate,
        orderEndDate: orderDetails.orderEndDate,
        orderType: orderDetails.orderType,
        orderTypeDescription: orderDetails.orderTypeDescription,
        orderTypeDetail: orderDetails.orderTypeDetail,
        wearingWristPid: orderDetails.wearingWristPid,
        notifyingOrganisationDetailsName: orderDetails.notifyingOrganisationDetailsName,
        responsibleOrganisation: orderDetails.responsibleOrganisation,
        responsibleOrganisationDetailsRegion: orderDetails.responsibleOrganisationDetailsRegion,
      },
      backUrl: buildUrl(paths.INTEGRITY_ORDER.SUMMARY, { legacySubjectId }),
    }
  },
}
