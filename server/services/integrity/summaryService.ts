import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient, HmppsAuthClient, RestClientBuilder } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityOrderSummary } from '../../interfaces/integrity/orderSummary'

export default class IntegritySummaryService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {
    this.emDatastoreApiClient = this.emDatastoreApiClientFactory('uninitialised')
  }

  async getSummary(input: OrderRequest): Promise<IntegrityOrderSummary> {
    try {
      this.emDatastoreApiClient.updateToken(input.userToken)
      return await this.emDatastoreApiClient.getIntegritySummary(input)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order summary'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
