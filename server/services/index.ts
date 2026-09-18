import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import { dataAccess } from '../data'

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

import logger from '../../logger'
import config from '../config'

export const services = () => {
  const { applicationInfo, integrityDatastoreClient, alcoholMonitoringDatastoreClient } = dataAccess()

  const auditService = AuditServiceFactory.createInstance(config.sqs.audit, logger)

  return {
    applicationInfo,
    auditService,

    emDatastoreConnectionService: new EmDatastoreConnectionService(integrityDatastoreClient),
    emDatastoreOrderSearchService: new EmDatastoreOrderSearchService(integrityDatastoreClient),

    integrityOrderDetailsService: new IntegrityOrderDetailsService(integrityDatastoreClient),
    integrityEventHistoryService: new IntegrityEventHistoryService(integrityDatastoreClient),
    integritySuspensionOfVisitsService: new IntegritySuspensionOfVisitsService(integrityDatastoreClient),
    integrityEquipmentDetailsService: new IntegrityEquipmentDetailsService(integrityDatastoreClient),
    integrityVisitDetailsService: new IntegrityVisitDetailsService(integrityDatastoreClient),
    integrityServiceDetailsService: new IntegrityServiceDetailsService(integrityDatastoreClient),

    alcoholMonitoringOrderDetailsService: new AlcoholMonitoringOrderDetailsService(alcoholMonitoringDatastoreClient),
    alcoholMonitoringEventHistoryService: new AlcoholMonitoringEventHistoryService(alcoholMonitoringDatastoreClient),
    alcoholMonitoringEquipmentDetailsService: new AlcoholMonitoringEquipmentDetailsService(
      alcoholMonitoringDatastoreClient,
    ),
    alcoholMonitoringVisitDetailsService: new AlcoholMonitoringVisitDetailsService(alcoholMonitoringDatastoreClient),
    alcoholMonitoringServiceDetailsService: new AlcoholMonitoringServiceDetailsService(
      alcoholMonitoringDatastoreClient,
    ),
  }
}

export type Services = ReturnType<typeof services>
