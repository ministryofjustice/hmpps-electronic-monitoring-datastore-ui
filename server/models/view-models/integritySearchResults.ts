import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'

export type IntegritySearchResult = {
  legacySubjectId?: string
  name?: string | null
  primaryAddress?: (string | null | undefined)[]
  alias?: string | null
  dateOfBirth?: string | null
  orderStartDate?: string | null
  orderEndDate?: string | null
  sortAddress?: string | null
  sortDateOfBirth?: number | null
  sortOrderStartDate?: number | null
  sortOrderEndDate?: number | null
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
        sortDateOfBirth: order.dateOfBirth ? new Date(`${order.dateOfBirth}Z`).getTime() : null,
        sortOrderStartDate: order.orderStartDate ? new Date(`${order.orderStartDate}Z`).getTime() : null,
        sortOrderEndDate: order.orderEndDate ? new Date(`${order.orderEndDate}Z`).getTime() : null,
      } as IntegritySearchResult
    })
  },
}
