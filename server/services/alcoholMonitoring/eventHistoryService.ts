import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient, HmppsAuthClient, RestClientBuilder } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringContactEvent } from '../../models/alcoholMonitoring/contactEvents'
import { AlcoholMonitoringIncidentEvent } from '../../models/alcoholMonitoring/incidentEvents'
import { AlcoholMonitoringViolationEvent } from '../../models/alcoholMonitoring/violationEvents'

export default class AlcoholMonitoringEventHistoryService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialized')
  }

  async getEventHistory(
    input: OrderRequest,
  ): Promise<(AlcoholMonitoringContactEvent | AlcoholMonitoringIncidentEvent | AlcoholMonitoringViolationEvent)[]> {
    try {
      this.emDatastoreApiClient.updateToken(input.userToken)
      return (
        await Promise.all([
          this.emDatastoreApiClient.getAlcoholMonitoringContactEvents(input),
          this.emDatastoreApiClient.getAlcoholMonitoringIncidentEvents(input),
          this.emDatastoreApiClient.getAlcoholMonitoringViolationEvents(input),
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
