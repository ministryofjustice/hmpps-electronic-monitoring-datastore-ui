import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'
import { HmppsAuthClient, RestClientBuilder } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringOrderSummary } from '../../models/alcoholMonitoring/orderSummary'

export default class AlcoholMonitoringSummaryService {
  private readonly emDatastoreApiClient: EmDatastoreApiClient

  constructor(
    private readonly emDatastoreApiClientFactory: RestClientBuilder<EmDatastoreApiClient>,
    private readonly hmppsAuthClient: HmppsAuthClient,
  ) {}

  async getSummary(input: OrderRequest): Promise<AlcoholMonitoringOrderSummary> {
    try {
      return await this.emDatastoreApiClientFactory(input.userToken).getAlcoholMonitoringSummary(input)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order summary'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
