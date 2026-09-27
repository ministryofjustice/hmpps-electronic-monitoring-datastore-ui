import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'
import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'

export type OrderSearchResult = {
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

export const OrderSearchResultsView = {
  fromIntegrityOrder(orders: IntegrityOrderDetails[]): OrderSearchResult[] {
    return orders.map((order: IntegrityOrderDetails) => {
      const primaryAddress = [
        order.primaryAddressLine1,
        order.primaryAddressLine2,
        order.primaryAddressLine3,
        order.primaryAddressPostCode,
      ].filter(n => n && n !== '')

      return {
        ...order,
        legacySubjectId: order.legacySubjectId,
        name: [order.firstName, order.lastName].join(' '),
        primaryAddress,
        alias: order.alias,
        dateOfBirth: order.dateOfBirth,
        orderStartDate: order.orderStartDate,
        orderEndDate: order.orderEndDate,
        sortAddress: primaryAddress.join(' '),
        sortDateOfBirth: order.dateOfBirth ? new Date(`${order.dateOfBirth}Z`).getTime() : null,
        sortOrderStartDate: order.orderStartDate ? new Date(`${order.orderStartDate}Z`).getTime() : null,
        sortOrderEndDate: order.orderEndDate ? new Date(`${order.orderEndDate}Z`).getTime() : null,
      } as OrderSearchResult
    })
  },

  fromAlcoholMonitoringOrder(orders: AlcoholMonitoringOrderDetails[]): OrderSearchResult[] {
    return orders.map((order: AlcoholMonitoringOrderDetails) => {
      const primaryAddress = [order.address1, order.address2, order.address3, order.postcode].filter(n => n && n !== '')

      return {
        ...order,
        legacySubjectId: order.legacySubjectId,
        name: [order.firstName, order.lastName].join(' '),
        primaryAddress,
        alias: order.alias,
        dateOfBirth: order.dateOfBirth,
        orderStartDate: order.orderStartDate,
        orderEndDate: order.orderEndDate,
        sortAddress: primaryAddress.join(' '),
        sortDateOfBirth: order.dateOfBirth ? new Date(`${order.dateOfBirth}Z`).getTime() : null,
        sortOrderStartDate: order.orderStartDate ? new Date(`${order.orderStartDate}Z`).getTime() : null,
        sortOrderEndDate: order.orderEndDate ? new Date(`${order.orderEndDate}Z`).getTime() : null,
      } as OrderSearchResult
    })
  },
}
