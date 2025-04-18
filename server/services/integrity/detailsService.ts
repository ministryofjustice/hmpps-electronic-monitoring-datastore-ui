import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IndegrityOrderDetails } from '../../interfaces/integrity/orderDetails'

export default class IntegrityDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getDetails(input: OrderRequest): Promise<IndegrityOrderDetails> {
    try {
      return await this.emDatastoreApiClient.getIntegrityDetails(input, input.userToken)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
