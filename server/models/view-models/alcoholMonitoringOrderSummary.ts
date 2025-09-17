import paths from '../../constants/paths'
import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'

export type AlcoholMonitoringOrderSummaryView = {
  legacySubjectId: string
  orderSummary: {
    legacySubjectId: string
    name?: string
    alias?: string
    dateOfBirth?: string
    primaryAddress?: string[]
    orderStartDate?: string
    orderEndDate?: string
  }
  backUrl: string
}

export const AlcoholMonitoringOrderSummaryView = {
  construct(legacySubjectId: string, orderDetails: AlcoholMonitoringOrderDetails): AlcoholMonitoringOrderSummaryView {
    return {
      legacySubjectId,
      orderSummary: {
        legacySubjectId,
        name: [orderDetails.firstName, orderDetails.lastName].join(' '),
        alias: orderDetails.alias,
        dateOfBirth: orderDetails.dateOfBirth,
        primaryAddress: [
          orderDetails.address1,
          orderDetails.address2,
          orderDetails.address3,
          orderDetails.postcode,
        ].filter(n => n && n !== ''),
        orderStartDate: orderDetails.orderStartDate,
        orderEndDate: orderDetails.orderEndDate,
      },
      backUrl: paths.ALCOHOL_MONITORING.INDEX,
    }
  },
}
