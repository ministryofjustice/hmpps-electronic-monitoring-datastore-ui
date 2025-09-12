import { dataAccess } from '../data'
import AuditService from './auditService'
import EmDatastoreConnectionService from './emDatastoreConnectionService'
import EmDatastoreOrderSearchService from './emDatastoreOrderSearchService'
import IntegrityDetailsService from './integrity/orderDetailsService'
import AlcoholMonitoringDetailsService from './alcoholMonitoring/orderDetailsService'
import IntegrityEventHistoryService from './integrity/eventHistoryService'
import AlcoholMonitoringEventHistoryService from './alcoholMonitoring/eventHistoryService'
import IntegritySuspensionOfVisitsService from './integrity/suspensionOfVisitsService'
import IntegrityEquipmentDetailsService from './integrity/equipmentDetailsService'
import AlcoholMonitoringEquipmentDetailsService from './alcoholMonitoring/equipmentDetailsService'
import IntegrityVisitDetailsService from './integrity/visitDetailsService'
import AlcoholMonitoringVisitDetailsService from './alcoholMonitoring/visitDetailsService'
import IntegrityServiceDetailsService from './integrity/serviceDetailsService'
import AlcoholMonitoringServiceDetailsService from './alcoholMonitoring/serviceDetailsService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, emDatastoreApiClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const emDatastoreConnectionService = new EmDatastoreConnectionService(emDatastoreApiClient)
  const emDatastoreOrderSearchService = new EmDatastoreOrderSearchService(emDatastoreApiClient)

  const integrityDetailsService = new IntegrityDetailsService(emDatastoreApiClient)
  const alcoholMonitoringDetailsService = new AlcoholMonitoringDetailsService(emDatastoreApiClient)
  const integrityEventHistoryService = new IntegrityEventHistoryService(emDatastoreApiClient)
  const alcoholMonitoringEventHistoryService = new AlcoholMonitoringEventHistoryService(emDatastoreApiClient)
  const integritySuspensionOfVisitsService = new IntegritySuspensionOfVisitsService(emDatastoreApiClient)
  const integrityEquipmentDetailsService = new IntegrityEquipmentDetailsService(emDatastoreApiClient)
  const alcoholMonitoringEquipmentDetailsService = new AlcoholMonitoringEquipmentDetailsService(emDatastoreApiClient)
  const integrityVisitDetailsService = new IntegrityVisitDetailsService(emDatastoreApiClient)
  const alcoholMonitoringVisitDetailsService = new AlcoholMonitoringVisitDetailsService(emDatastoreApiClient)
  const integrityServiceDetailsService = new IntegrityServiceDetailsService(emDatastoreApiClient)
  const alcoholMonitoringServiceDetailsService = new AlcoholMonitoringServiceDetailsService(emDatastoreApiClient)

  return {
    applicationInfo,
    auditService,
    emDatastoreConnectionService,
    integrityDetailsService,
    alcoholMonitoringDetailsService,
    emDatastoreOrderSearchService,
    integrityEventHistoryService,
    alcoholMonitoringEventHistoryService,
    integritySuspensionOfVisitsService,
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
  IntegrityEventHistoryService,
  AlcoholMonitoringEventHistoryService,
  IntegritySuspensionOfVisitsService,
  IntegrityEquipmentDetailsService,
  AlcoholMonitoringEquipmentDetailsService,
  IntegrityVisitDetailsService,
  AlcoholMonitoringVisitDetailsService,
  IntegrityServiceDetailsService,
  AlcoholMonitoringServiceDetailsService,
}
