import { dataAccess } from '../data'
import AuditService from './auditService'
import SearchService from './searchService'
import OrderService from './orderService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  const searchService = new SearchService(hmppsAuthClient)

  const orderService = new OrderService()

  return {
    applicationInfo,
    auditService,
    searchService,
    orderService,
  }
}

export type Services = ReturnType<typeof services>
