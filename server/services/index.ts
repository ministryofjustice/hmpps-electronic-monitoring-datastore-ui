import { dataAccess } from '../data'
import AuditService from './auditService'
import SearchService from './searchService'
import OrderService from './orderService'
import DatastoreSearchService from './datastoreSearchService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, hmppsAuditClient, datastoreSearchClientFactory } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  const searchService = new SearchService()

  const datastoreSearchService = new DatastoreSearchService(datastoreSearchClientFactory, hmppsAuthClient)

  const orderService = new OrderService()

  return {
    applicationInfo,
    auditService,
    searchService,
    orderService,
  }
}

export type Services = ReturnType<typeof services>
