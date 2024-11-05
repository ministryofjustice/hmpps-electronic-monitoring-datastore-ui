import { dataAccess } from '../data'
import AuditService from './auditService'
import SearchService from './searchService'
import OrderService from './orderService'
import DatastoreOrderService from './datastoreOrderService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, hmppsAuditClient, datastoreClientFactory } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  const searchService = new SearchService()

  const datastoreSearchService = new DatastoreOrderService(datastoreClientFactory, hmppsAuthClient)

  const orderService = new OrderService()

  return {
    applicationInfo,
    auditService,
    searchService,
    orderService,
  }
}

export type Services = ReturnType<typeof services>
