import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityContactEvent } from '../../models/integrity/contactEvents'
import { IntegrityIncidentEvent } from '../../models/integrity/incidentEvents'
import { IntegrityMonitoringEvent } from '../../models/integrity/monitoringEvents'
import { IntegrityViolationEvent } from '../../models/integrity/violationEvents'

export default class IntegrityEventHistoryService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEventHistory(
    input: OrderRequest,
  ): Promise<(IntegrityContactEvent | IntegrityIncidentEvent | IntegrityMonitoringEvent | IntegrityViolationEvent)[]> {
    try {
      return (
        await Promise.all([
          this.emDatastoreApiClient.getIntegrityMonitoringEvents(input, input.userToken),
          this.emDatastoreApiClient.getIntegrityIncidentEvents(input, input.userToken),
          this.emDatastoreApiClient.getIntegrityContactEvents(input, input.userToken),
          this.emDatastoreApiClient.getIntegrityViolationEvents(input, input.userToken),
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
