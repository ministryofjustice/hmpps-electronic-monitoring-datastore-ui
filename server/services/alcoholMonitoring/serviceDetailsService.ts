import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient, HmppsAuthClient, RestClientBuilder } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringServiceDetails } from '../../models/alcoholMonitoring/serviceDetails'

export default class AlcoholMonitoringServiceDetailService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialized')
  }

  async getServiceDetails(input: OrderRequest): Promise<AlcoholMonitoringServiceDetails[]> {
    try {
      this.emDatastoreApiClient.updateToken(input.userToken)
      return await this.emDatastoreApiClient.getAlcoholMonitoringServiceDetails(input)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving service details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
