import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'

export type AlchoholMonitoringSearchResultView = {
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

const createViewModelFromApiDto = (orders: AlcoholMonitoringOrderDetails[]): AlchoholMonitoringSearchResultView =>
  orders.map((order: AlcoholMonitoringOrderDetails) => {
    return {
      ...order,
      legacySubjectId: order.legacySubjectId,
      firstName: order.firstName,
      lastName: order.lastName,
      primaryAddressLine1: order.address1,
      primaryAddressLine2: order.address2,
      primaryAddressLine3: order.address3,
      primaryAddressPostCode: order.postcode,
      alias: order.alias,
      dateOfBirth: order.dateOfBirth,
      orderStartDate: order.orderStartDate,
      orderEndDate: order.orderEndDate,
      sortAddress: (order.address1 || '') + (order.address2 || '') + (order.address3 || '') + (order.postcode || ''),
      sortDateOfBirth: new Date(`${order.dateOfBirth}Z`).getTime(),
      sortOrderStartDate: new Date(`${order.orderStartDate}Z`).getTime(),
      sortOrderEndDate: new Date(`${order.orderEndDate}Z`).getTime(),
    }
  })

export const AlchoholMonitoringSearchResultView = {
  construct(orders: AlcoholMonitoringOrderDetails[]): AlchoholMonitoringSearchResultView {
    return createViewModelFromApiDto(orders)
  },
}
