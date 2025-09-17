import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'

export type AlchoholMonitoringSearchResult = {
  legacySubjectId?: string
  name?: string
  primaryAddress?: string[]
  alias?: string | null
  dateOfBirth?: string
  orderStartDate?: string
  orderEndDate?: string
  sortAddress?: string
  sortDateOfBirth?: number
  sortOrderStartDate?: number
  sortOrderEndDate?: number
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
        sortDateOfBirth: new Date(`${order.dateOfBirth}Z`).getTime(),
        sortOrderStartDate: new Date(`${order.orderStartDate}Z`).getTime(),
        sortOrderEndDate: new Date(`${order.orderEndDate}Z`).getTime(),
      } as AlchoholMonitoringSearchResult
    })
  },
}
