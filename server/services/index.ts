import { dataAccess } from '../data'
import AuditService from './auditService'
import SearchService from './searchService'
import OrderService from './orderService'
import DatastoreOrderService from './datastoreOrderService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, hmppsAuditClient, datastoreClientFactory } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  // TODO: this is replaced by DatastoreSearchService
  const searchService = new SearchService()
  // const datastoreSearchService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)

  // TODO: Deprecate order servive in favour of DataStoreOrderService
  const orderService = new OrderService()
  const datastoreOrderService = new DatastoreOrderService(datastoreClientFactory, hmppsAuthClient)

  return {
    applicationInfo,
    auditService,
    searchService,
    orderService,
    datastoreOrderService,
  }
}

export type Services = ReturnType<typeof services>
