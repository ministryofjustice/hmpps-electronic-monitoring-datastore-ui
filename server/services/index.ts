import { dataAccess } from '../data'
import AuditService from './auditService'
import SearchService from './searchService'
import OrderService from './orderService'
import RestClient from '../data/restClient'
import config, { ApiConfig } from '../config'

const datastoreClient = new RestClient(
  'ElectronicMonitoringDatastoreApi',
  config.apis.electronicMonitoringDatastore as ApiConfig,
  'token not set'
)

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  const searchService = new SearchService(hmppsAuthClient, datastoreClient)

  const orderService = new OrderService()

  return {
    applicationInfo,
    auditService,
    searchService,
    orderService,
  }
}

export type Services = ReturnType<typeof services>
