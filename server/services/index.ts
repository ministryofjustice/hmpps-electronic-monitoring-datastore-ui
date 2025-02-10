import { dataAccess } from '../data'
import AuditService from './auditService'
import OrderService from './orderService'
import EventsService from './eventsService'
import DatastoreOrderService from './datastoreOrderService'
import DatastoreSearchService from './datastoreSearchService'
import EquipmentDetailsService from './equipmentDetailsService'
import VisitDetailsService from './visitDetailsService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, hmppsAuditClient, datastoreClientFactory } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const datastoreSearchService = new DatastoreSearchService(datastoreClientFactory, hmppsAuthClient)

  // TODO: Deprecate order service in favour of DataStoreOrderService
  const orderService = new OrderService()
  const datastoreOrderService = new DatastoreOrderService(datastoreClientFactory, hmppsAuthClient)
  const eventsService = new EventsService(datastoreClientFactory, hmppsAuthClient)
  const equipmentDetailsService = new EquipmentDetailsService(datastoreClientFactory, hmppsAuthClient)
  const visitDetailsService = new VisitDetailsService(datastoreClientFactory, hmppsAuthClient)

  return {
    applicationInfo,
    auditService,
    orderService,
    datastoreOrderService,
    datastoreSearchService,
    eventsService,
    equipmentDetailsService,
    visitDetailsService,
  }
}

export type Services = ReturnType<typeof services>
export {
  AuditService,
  DatastoreOrderService,
  DatastoreSearchService,
  EventsService,
  EquipmentDetailsService,
  VisitDetailsService,
}
