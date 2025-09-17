import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'

export type IntegritySearchResult = {
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

export type IntegritySearchResultView = IntegritySearchResult[]
export const IntegritySearchResultView = {
  construct(orders: IntegrityOrderDetails[]): IntegritySearchResultView {
    return orders.map((order: IntegrityOrderDetails) => {
      const primaryAddress = [
        order.primaryAddressLine1,
        order.primaryAddressLine2,
        order.primaryAddressLine3,
        order.primaryAddressPostCode,
      ]

      return {
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
      } as IntegritySearchResult
    })
  },
}
