import { dataAccess } from '../data'
import AuditService from './auditService'
import OrderService from './orderService'
import EventsService from './eventsService'
import DatastoreOrderService from './datastoreOrderService'
import DatastoreSearchService from './datastoreSearchService'
import SuspensionOfVisitsService from './suspensionOfVisitsService'
import EquipmentDetailsService from './equipmentDetailsService'
import VisitDetailsService from './visitDetailsService'
import CurfewTimetableService from './curfewTimetableService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, hmppsAuditClient, emDatastoreApiClientFactory } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const datastoreSearchService = new DatastoreSearchService(emDatastoreApiClientFactory, hmppsAuthClient)

  // TODO: Deprecate order service in favour of DataStoreOrderService
  const orderService = new OrderService()
  const datastoreOrderService = new DatastoreOrderService(emDatastoreApiClientFactory, hmppsAuthClient)
  const eventsService = new EventsService(emDatastoreApiClientFactory, hmppsAuthClient)
  const suspensionOfVisitsService = new SuspensionOfVisitsService(emDatastoreApiClientFactory, hmppsAuthClient)
  const equipmentDetailsService = new EquipmentDetailsService(emDatastoreApiClientFactory, hmppsAuthClient)
  const visitDetailsService = new VisitDetailsService(emDatastoreApiClientFactory, hmppsAuthClient)
  const curfewTimetableService = new CurfewTimetableService(emDatastoreApiClientFactory, hmppsAuthClient)

  return {
    applicationInfo,
    auditService,
    orderService,
    datastoreOrderService,
    datastoreSearchService,
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
  DatastoreSearchService,
  EventsService,
  SuspensionOfVisitsService,
  EquipmentDetailsService,
  VisitDetailsService,
  CurfewTimetableService,
}
