import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityOrderSummary, IntegrityOrderSummaryModel } from '../../models/integrity/orderSummary'

export default class IntegritySummaryService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getOrderSummary(input: OrderRequest): Promise<IntegrityOrderSummary> {
    try {
      const result = await this.emDatastoreApiClient.get<IntegrityOrderSummary>({
        path: `/orders/integrity/${input.legacySubjectId}`,
        token: input.userToken,
      })

      return IntegrityOrderSummaryModel.parse(result)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order summary'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
