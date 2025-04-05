import { dataAccess } from '../data'
import AuditService from './auditService'
import EmDatastoreConnectionService from './emDatastoreConnectionService'
import EmDatastoreOrderSearchService from './emDatastoreOrderSearchService'
import IntegritySummaryService from './integrity/summaryService'
import AlcoholMonitoringSummaryService from './alcoholMonitoring/summaryService'
import IntegrityDetailsService from './integrity/detailsService'
import AlcoholMonitoringDetailsService from './alcoholMonitoring/detailsService'
import EmDatastoreEventsService from './emDatastoreEventsService'
import EmDatastoreSuspensionOfVisitsService from './emDatastoreSuspensionOfVisitsService'
import EmDatastoreEquipmentDetailsService from './emDatastoreEquipmentDetailsService'
import EmDatastoreVisitDetailsService from './emDatastoreVisitDetailsService'
import EmDatastoreCurfewTimetableService from './emDatastoreCurfewTimetableService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, hmppsAuditClient, emDatastoreApiClientFactory } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const emDatastoreConnectionService = new EmDatastoreConnectionService(emDatastoreApiClientFactory, hmppsAuthClient)
  const emDatastoreOrderSearchService = new EmDatastoreOrderSearchService(emDatastoreApiClientFactory, hmppsAuthClient)

  const integrityDetailsService = new IntegrityDetailsService(emDatastoreApiClientFactory, hmppsAuthClient)
  const alcoholMonitoringDetailsService = new AlcoholMonitoringDetailsService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )
  const integritySummaryService = new IntegritySummaryService(emDatastoreApiClientFactory, hmppsAuthClient)
  const alcoholMonitoringSummaryService = new AlcoholMonitoringSummaryService(
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
    integrityDetailsService,
    alcoholMonitoringDetailsService,
    integritySummaryService,
    alcoholMonitoringSummaryService,
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
  IntegrityDetailsService,
  AlcoholMonitoringDetailsService,
  IntegritySummaryService,
  AlcoholMonitoringSummaryService,
  EmDatastoreEventsService,
  EmDatastoreSuspensionOfVisitsService,
  EmDatastoreEquipmentDetailsService,
  EmDatastoreVisitDetailsService,
  EmDatastoreCurfewTimetableService,
}
