import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'

export type IntegritySearchResultsView = {
  legacySubjectId?: string
  firstName?: string
  lastName?: string
  primaryAddressLine1?: string
  primaryAddressLine2?: string
  primaryAddressLine3?: string
  primaryAddressPostCode?: string
  alias?: string | null
  dateOfBirth?: string
  orderStartDate?: string
  orderEndDate?: string
  sortAddress?: string
  sortDateOfBirth?: number
  sortOrderStartDate?: number
  sortOrderEndDate?: number
}[]

const createViewModelFromApiDto = (orders: IntegrityOrderDetails[]): IntegritySearchResultsView =>
  orders.map((order: IntegrityOrderDetails) => {
    return {
      legacySubjectId: order.legacySubjectId,
      firstName: order.firstName,
      lastName: order.lastName,
      primaryAddressLine1: order.primaryAddressLine1,
      primaryAddressLine2: order.primaryAddressLine2,
      primaryAddressLine3: order.primaryAddressLine3,
      primaryAddressPostCode: order.primaryAddressPostCode,
      alias: order.alias,
      dateOfBirth: order.dateOfBirth,
      orderStartDate: order.orderStartDate,
      orderEndDate: order.orderEndDate,
      sortAddress:
        (order.primaryAddressLine1 || '') +
        (order.primaryAddressLine2 || '') +
        (order.primaryAddressLine3 || '') +
        (order.primaryAddressPostCode || ''),
      sortDateOfBirth: new Date(`${order.dateOfBirth}Z`).getTime(),
      sortOrderStartDate: new Date(`${order.orderStartDate}Z`).getTime(),
      sortOrderEndDate: new Date(`${order.orderEndDate}Z`).getTime(),
    }
  })

export const IntegritySearchResultView = {
  construct(orders: IntegrityOrderDetails[]): IntegritySearchResultsView {
    return createViewModelFromApiDto(orders)
  },
}
