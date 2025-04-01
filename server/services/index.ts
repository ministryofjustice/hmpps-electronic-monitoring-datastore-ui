import { dataAccess } from '../data'
import AuditService from './auditService'
import EmDatastoreOrderDetailsService from './emDatastoreOrderDetailsService'
import EmDatastoreOrderSummaryService from './emDatastoreOrderSummaryService'
import EmDatastoreConnectionService from './emDatastoreConnectionService'
import EmDatastoreEventsService from './emDatastoreEventsService'
import EmDatastoreOrderSearchService from './emDatastoreOrderSearchService'
import EmDatastoreSuspensionOfVisitsService from './emDatastoreSuspensionOfVisitsService'
import EmDatastoreEquipmentDetailsService from './emDatastoreEquipmentDetailsService'
import EmDatastoreVisitDetailsService from './emDatastoreVisitDetailsService'
import EmDatastoreCurfewTimetableService from './emDatastoreCurfewTimetableService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, hmppsAuditClient, emDatastoreApiClientFactory } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const emDatastoreConnectionService = new EmDatastoreConnectionService(emDatastoreApiClientFactory, hmppsAuthClient)
  const emDatastoreOrderSearchService = new EmDatastoreOrderSearchService(emDatastoreApiClientFactory, hmppsAuthClient)
  const emDatastoreOrderDetailsService = new EmDatastoreOrderDetailsService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )
  const emDatastoreOrderSummaryService = new EmDatastoreOrderSummaryService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )
  const emDatastoreEventsService = new EmDatastoreEventsService(emDatastoreApiClientFactory, hmppsAuthClient)
  const emDatastoreSuspensionOfVisitsService = new EmDatastoreSuspensionOfVisitsService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )
  const emDatastoreEquipmentDetailsService = new EmDatastoreEquipmentDetailsService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )
  const emDatastoreVisitDetailsService = new EmDatastoreVisitDetailsService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )
  const emDatastoreCurfewTimetableService = new EmDatastoreCurfewTimetableService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )

  return {
    applicationInfo,
    auditService,
    emDatastoreConnectionService,
    emDatastoreOrderDetailsService,
    emDatastoreOrderSummaryService,
    emDatastoreOrderSearchService,
    emDatastoreEventsService,
    emDatastoreSuspensionOfVisitsService,
    emDatastoreEquipmentDetailsService,
    emDatastoreVisitDetailsService,
    emDatastoreCurfewTimetableService,
  }
}

export type Services = ReturnType<typeof services>
export {
  AuditService,
  EmDatastoreConnectionService,
  EmDatastoreOrderSearchService,
  EmDatastoreOrderDetailsService,
  EmDatastoreOrderSummaryService,
  EmDatastoreEventsService,
  EmDatastoreSuspensionOfVisitsService,
  EmDatastoreEquipmentDetailsService,
  EmDatastoreVisitDetailsService,
  EmDatastoreCurfewTimetableService,
}
