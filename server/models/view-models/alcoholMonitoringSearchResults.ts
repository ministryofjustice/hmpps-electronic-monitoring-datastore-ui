import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'

export type AlchoholMonitoringSearchResult = {
  legacySubjectId?: string | null
  name?: string | null
  primaryAddress?: (string | null)[]
  alias?: string | null
  dateOfBirth?: string | null
  orderStartDate?: string | null
  orderEndDate?: string | null
  sortAddress?: string | null
  sortDateOfBirth?: number | null
  sortOrderStartDate?: number | null
  sortOrderEndDate?: number | null
}

export type AlchoholMonitoringSearchResultView = AlchoholMonitoringSearchResult[]
export const AlchoholMonitoringSearchResultView = {
  construct(orders: AlcoholMonitoringOrderDetails[]): AlchoholMonitoringSearchResultView {
    return orders.map((order: AlcoholMonitoringOrderDetails) => {
      const primaryAddress = [order.address1, order.address2, order.address3, order.postcode]

      return {
        ...order,
        legacySubjectId: order.legacySubjectId,
        name: [order.firstName, order.lastName].join(' '),
        primaryAddress,
        alias: order.alias,
        dateOfBirth: order.dateOfBirth,
        orderStartDate: order.orderStartDate,
        orderEndDate: order.orderEndDate,
        sortAddress: primaryAddress.filter(n => n && n !== '').join(' '),
        sortDateOfBirth: order.dateOfBirth ? new Date(`${order.dateOfBirth}Z`).getTime() : null,
        sortOrderStartDate: order.orderStartDate ? new Date(`${order.orderStartDate}Z`).getTime() : null,
        sortOrderEndDate: order.orderEndDate ? new Date(`${order.orderEndDate}Z`).getTime() : null,
      } as AlchoholMonitoringSearchResult
    })
  },
}
