import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityOrderDetails, IntegrityOrderDetailsModel } from '../../models/integrity/orderDetails'

export default class IntegrityDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getOrderDetails(input: OrderRequest): Promise<IntegrityOrderDetails> {
    try {
      const result = await this.emDatastoreApiClient.get<IntegrityOrderDetails>({
        path: `/orders/integrity/${input.legacySubjectId}/details`,
        token: input.userToken,
      })

      return IntegrityOrderDetailsModel.parse(result)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
