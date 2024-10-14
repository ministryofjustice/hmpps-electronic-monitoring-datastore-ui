import { dataAccess } from '../data'
import AuditService from './auditService'
import SearchService from './searchService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  const searchService = new SearchService()

  return {
    applicationInfo,
    auditService,
    searchService,
  }
}

export type Services = ReturnType<typeof services>
