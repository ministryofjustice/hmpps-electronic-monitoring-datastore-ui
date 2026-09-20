import { paths } from '../../constants/paths'
import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'

export type IntegrityOrderSummaryView = {
  legacySubjectId: string
  orderSummary: {
    legacySubjectId: string
    name?: string | null
    alias?: string | null
    dateOfBirth?: string | null
    primaryAddress?: (string | null | undefined)[]
    specials?: string | null
    orderStartDate?: string | null
    orderEndDate?: string | null
  }
  backUrl: string
}

export const IntegrityOrderSummaryView = {
  construct(legacySubjectId: string, orderDetails: IntegrityOrderDetails): IntegrityOrderSummaryView {
    return {
      legacySubjectId,
      orderSummary: {
        legacySubjectId,
        name: [orderDetails.firstName, orderDetails.lastName].join(' '),
        alias: orderDetails.alias,
        dateOfBirth: orderDetails.dateOfBirth,
        primaryAddress: [
          orderDetails.primaryAddressLine1,
          orderDetails.primaryAddressLine2,
          orderDetails.primaryAddressLine3,
          orderDetails.primaryAddressPostCode,
        ].filter(n => n && n !== ''),
        specials: orderDetails.specials,
        orderStartDate: orderDetails.orderStartDate,
        orderEndDate: orderDetails.orderEndDate,
      },
      backUrl: paths.INTEGRITY_ORDER.INDEX,
    }
  },
}
