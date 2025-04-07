import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringVisitDetails } from '../../models/alcoholMonitoring/visitDetails'

export default class AlcoholMonitoringVisitDetailsService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialized')
  }

  async getVisitDetails(input: OrderRequest): Promise<AlcoholMonitoringVisitDetails[]> {
    try {
      this.emDatastoreApiClient.updateToken(input.userToken)
      return await this.emDatastoreApiClient.getAlcoholMonitoringVisitDetails(input)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of visit details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
