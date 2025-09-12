import { Order } from '../order'

export type OrdersViewModel = {
  legacySubjectId?: string
  firstName?: string
  lastName?: string
  primaryAddressLine1?: string
  primaryAddressLine2?: string
  primaryAddressLine3?: string
  primaryAddressPostcode?: string
  alias?: string | null
  dateOfBirth?: string
  orderStartDate?: string
  orderEndDate?: string
  sortAddress?: string
  sortDateOfBirth?: number
  sortOrderStartDate?: number
  sortOrderEndDate?: number
}[]

const createViewModelFromApiDto = (orders: Order[]): OrdersViewModel =>
  orders.map((order: Order) => {
    return {
      ...order,
      legacySubjectId: order.legacySubjectId,
      firstName: order.firstName,
      lastName: order.lastName,
      primaryAddressLine1: order.primaryAddressLine1,
      primaryAddressLine2: order.primaryAddressLine2,
      primaryAddressLine3: order.primaryAddressLine3,
      primaryAddressPostcode: order.primaryAddressPostcode,
      alias: order.alias,
      dateOfBirth: order.dateOfBirth,
      orderStartDate: order.orderStartDate,
      orderEndDate: order.orderEndDate,
      sortAddress:
        (order.primaryAddressLine1 || '') +
        (order.primaryAddressLine2 || '') +
        (order.primaryAddressLine3 || '') +
        (order.primaryAddressPostcode || ''),
      sortDateOfBirth: new Date(`${order.dateOfBirth}Z`).getTime(),
      sortOrderStartDate: new Date(`${order.orderStartDate}Z`).getTime(),
      sortOrderEndDate: new Date(`${order.orderEndDate}Z`).getTime(),
    }
  })

const construct = (orders: Order[]): OrdersViewModel => createViewModelFromApiDto(orders)

export default {
  construct,
}
