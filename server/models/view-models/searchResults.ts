import { Order } from '../order'

export type OrdersViewModel = {
  dataType: string
  legacySubjectId?: string
  firstName?: string
  lastName?: string
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressPostcode?: string
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
      dataType: order.dataType,
      ...order,
      legacySubjectId: order.legacySubjectId,
      firstName: order.firstName,
      lastName: order.lastName,
      addressLine1: order.addressLine1,
      addressLine2: order.addressLine2,
      addressLine3: order.addressLine3,
      addressPostcode: order.addressPostcode,
      alias: order.alias,
      dateOfBirth: order.dateOfBirth,
      orderStartDate: order.orderStartDate,
      orderEndDate: order.orderEndDate,
      sortAddress:
        (order.addressLine1 || '') +
        (order.addressLine2 || '') +
        (order.addressLine3 || '') +
        (order.addressPostcode || ''),
      sortDateOfBirth: new Date(`${order.dateOfBirth}Z`).getTime(),
      sortOrderStartDate: new Date(`${order.orderStartDate}Z`).getTime(),
      sortOrderEndDate: new Date(`${order.orderEndDate}Z`).getTime(),
    }
  })

const construct = (orders: Order[]): OrdersViewModel => createViewModelFromApiDto(orders)

export default {
  construct,
}
