import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringContactEvent } from '../../models/alcoholMonitoring/contactEvents'
import { AlcoholMonitoringIncidentEvent } from '../../models/alcoholMonitoring/incidentEvents'
import { AlcoholMonitoringViolationEvent } from '../../models/alcoholMonitoring/violationEvents'

export default class AlcoholMonitoringEventHistoryService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEventHistory(
    input: OrderRequest,
  ): Promise<(AlcoholMonitoringContactEvent | AlcoholMonitoringIncidentEvent | AlcoholMonitoringViolationEvent)[]> {
    try {
      return (
        await Promise.all([
          this.emDatastoreApiClient.getAlcoholMonitoringContactEvents(input, input.userToken),
          this.emDatastoreApiClient.getAlcoholMonitoringIncidentEvents(input, input.userToken),
          this.emDatastoreApiClient.getAlcoholMonitoringViolationEvents(input, input.userToken),
        ])
      ).flat()
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving event history'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
