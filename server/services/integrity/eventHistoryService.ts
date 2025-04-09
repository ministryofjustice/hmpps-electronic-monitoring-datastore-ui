import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient, HmppsAuthClient, RestClientBuilder } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityContactEvent } from '../../models/integrity/contactEvents'
import { IntegrityIncidentEvent } from '../../models/integrity/incidentEvents'
import { IntegrityMonitoringEvent } from '../../models/integrity/monitoringEvents'
import { IntegrityViolationEvent } from '../../models/integrity/violationEvents'

export default class IntegrityEventHistoryService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialized')
  }

  async getEventHistory(
    input: OrderRequest,
  ): Promise<(IntegrityContactEvent | IntegrityIncidentEvent | IntegrityMonitoringEvent | IntegrityViolationEvent)[]> {
    try {
      this.emDatastoreApiClient.updateToken(input.userToken)
      return (
        await Promise.all([
          this.emDatastoreApiClient.getIntegrityMonitoringEvents(input),
          this.emDatastoreApiClient.getIntegrityIncidentEvents(input),
          this.emDatastoreApiClient.getIntegrityContactEvents(input),
          this.emDatastoreApiClient.getIntegrityViolationEvents(input),
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
