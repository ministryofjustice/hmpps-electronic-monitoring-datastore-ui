import { dataAccess } from '../data'
import AuditService from './auditService'
import OrderService from './orderService'
import EventsService from './eventsService'
import DatastoreOrderService from './datastoreOrderService'
import SearchService from './searchService'
import SuspensionOfVisitsService from './suspensionOfVisitsService'
import EquipmentDetailsService from './equipmentDetailsService'
import VisitDetailsService from './visitDetailsService'
import CurfewTimetableService from './curfewTimetableService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, hmppsAuditClient, datastoreClientFactory } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const searchService = new SearchService(datastoreClientFactory, hmppsAuthClient)

  // TODO: Deprecate order service in favour of DataStoreOrderService
  const orderService = new OrderService()
  const datastoreOrderService = new DatastoreOrderService(datastoreClientFactory, hmppsAuthClient)
  const eventsService = new EventsService(datastoreClientFactory, hmppsAuthClient)
  const suspensionOfVisitsService = new SuspensionOfVisitsService(datastoreClientFactory, hmppsAuthClient)
  const equipmentDetailsService = new EquipmentDetailsService(datastoreClientFactory, hmppsAuthClient)
  const visitDetailsService = new VisitDetailsService(datastoreClientFactory, hmppsAuthClient)
  const curfewTimetableService = new CurfewTimetableService(datastoreClientFactory, hmppsAuthClient)

  return {
    applicationInfo,
    auditService,
    orderService,
    datastoreOrderService,
    searchService,
    eventsService,
    suspensionOfVisitsService,
    equipmentDetailsService,
    visitDetailsService,
    curfewTimetableService,
  }
}

export type Services = ReturnType<typeof services>
export {
  AuditService,
  DatastoreOrderService,
  SearchService,
  EventsService,
  SuspensionOfVisitsService,
  EquipmentDetailsService,
  VisitDetailsService,
  CurfewTimetableService,
}
