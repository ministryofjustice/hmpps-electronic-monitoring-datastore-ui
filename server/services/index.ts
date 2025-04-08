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
import IntegrityEquipmentDetailsService from './integrity/equipmentDetailsService'
import AlcoholMonitoringEquipmentDetailsService from './alcoholMonitoring/equipmentDetailsService'
import IntegrityVisitDetailsService from './integrity/visitDetailsService'
import AlcoholMonitoringVisitDetailsService from './alcoholMonitoring/visitDetailsService'
import IntegrityServiceDetailsService from './integrity/serviceDetailsService'
import AlcoholMonitoringServiceDetailsService from './alcoholMonitoring/serviceDetailsService'

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
  const integrityEquipmentDetailsService = new IntegrityEquipmentDetailsService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )
  const alcoholMonitoringEquipmentDetailsService = new AlcoholMonitoringEquipmentDetailsService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )
  const integrityVisitDetailsService = new IntegrityVisitDetailsService(emDatastoreApiClientFactory, hmppsAuthClient)
  const alcoholMonitoringVisitDetailsService = new AlcoholMonitoringVisitDetailsService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )
  const integrityServiceDetailsService = new IntegrityServiceDetailsService(
    emDatastoreApiClientFactory,
    hmppsAuthClient,
  )
  const alcoholMonitoringServiceDetailsService = new AlcoholMonitoringServiceDetailsService(
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
    integrityEquipmentDetailsService,
    alcoholMonitoringEquipmentDetailsService,
    integrityVisitDetailsService,
    alcoholMonitoringVisitDetailsService,
    integrityServiceDetailsService,
    alcoholMonitoringServiceDetailsService,
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
  IntegrityEquipmentDetailsService,
  AlcoholMonitoringEquipmentDetailsService,
  IntegrityVisitDetailsService,
  AlcoholMonitoringVisitDetailsService,
  IntegrityServiceDetailsService,
  AlcoholMonitoringServiceDetailsService,
}
