import { dataAccess } from '../data'
import AuditService from './auditService'
import OrderService from './orderService'
import DatastoreOrderService from './datastoreOrderService'
import DatastoreSearchService from './datastoreSearchService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, hmppsAuditClient, datastoreClientFactory } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const datastoreSearchService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)

  // TODO: Deprecate order servive in favour of DataStoreOrderService
  const orderService = new OrderService()
  const datastoreOrderService = new DatastoreOrderService(datastoreClientFactory, hmppsAuthClient)

  return {
    applicationInfo,
    auditService,
    orderService,
    datastoreOrderService,
    datastoreSearchService,
  }
}

export type Services = ReturnType<typeof services>
export { AuditService, DatastoreOrderService, DatastoreSearchService }
