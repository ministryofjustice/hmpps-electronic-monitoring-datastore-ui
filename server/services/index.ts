import { dataAccess } from '../data'
import AuditService from './auditService'

import EmDatastoreConnectionService from './emDatastoreConnectionService'
import EmDatastoreOrderSearchService from './emDatastoreOrderSearchService'

import IntegrityOrderDetailsService from './integrity/orderDetailsService'
import IntegrityEventHistoryService from './integrity/eventHistoryService'
import IntegritySuspensionOfVisitsService from './integrity/suspensionOfVisitsService'
import IntegrityEquipmentDetailsService from './integrity/equipmentDetailsService'
import IntegrityVisitDetailsService from './integrity/visitDetailsService'
import IntegrityServiceDetailsService from './integrity/serviceDetailsService'

import AlcoholMonitoringOrderDetailsService from './alcoholMonitoring/orderDetailsService'
import AlcoholMonitoringEventHistoryService from './alcoholMonitoring/eventHistoryService'
import AlcoholMonitoringEquipmentDetailsService from './alcoholMonitoring/equipmentDetailsService'
import AlcoholMonitoringVisitDetailsService from './alcoholMonitoring/visitDetailsService'
import AlcoholMonitoringServiceDetailsService from './alcoholMonitoring/serviceDetailsService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, emDatastoreApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),

    emDatastoreConnectionService: new EmDatastoreConnectionService(emDatastoreApiClient),
    emDatastoreOrderSearchService: new EmDatastoreOrderSearchService(emDatastoreApiClient),

    integrityOrderDetailsService: new IntegrityOrderDetailsService(emDatastoreApiClient),
    integrityEventHistoryService: new IntegrityEventHistoryService(emDatastoreApiClient),
    integritySuspensionOfVisitsService: new IntegritySuspensionOfVisitsService(emDatastoreApiClient),
    integrityEquipmentDetailsService: new IntegrityEquipmentDetailsService(emDatastoreApiClient),
    integrityVisitDetailsService: new IntegrityVisitDetailsService(emDatastoreApiClient),
    integrityServiceDetailsService: new IntegrityServiceDetailsService(emDatastoreApiClient),

    alcoholMonitoringOrderDetailsService: new AlcoholMonitoringOrderDetailsService(emDatastoreApiClient),
    alcoholMonitoringEventHistoryService: new AlcoholMonitoringEventHistoryService(emDatastoreApiClient),
    alcoholMonitoringEquipmentDetailsService: new AlcoholMonitoringEquipmentDetailsService(emDatastoreApiClient),
    alcoholMonitoringVisitDetailsService: new AlcoholMonitoringVisitDetailsService(emDatastoreApiClient),
    alcoholMonitoringServiceDetailsService: new AlcoholMonitoringServiceDetailsService(emDatastoreApiClient),
  }
}

export type Services = ReturnType<typeof services>
