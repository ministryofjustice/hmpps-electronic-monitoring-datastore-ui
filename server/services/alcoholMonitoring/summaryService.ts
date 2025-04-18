import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringOrderSummary } from '../../models/alcoholMonitoring/orderSummary'

export default class AlcoholMonitoringSummaryService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getSummary(input: OrderRequest): Promise<AlcoholMonitoringOrderSummary> {
    try {
      return await this.emDatastoreApiClient.getAlcoholMonitoringSummary(input, input.userToken)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order summary'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
