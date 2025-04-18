import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityOrderSummary } from '../../interfaces/integrity/orderSummary'

export default class IntegritySummaryService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getSummary(input: OrderRequest): Promise<IntegrityOrderSummary> {
    try {
      return await this.emDatastoreApiClient.getIntegritySummary(input, input.userToken)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order summary'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
