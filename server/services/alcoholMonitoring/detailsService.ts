import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringOrderDetails } from '../../models/alcoholMonitoring/orderDetails'

export default class AlcoholMonitoringDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getDetails(input: OrderRequest): Promise<AlcoholMonitoringOrderDetails> {
    try {
      return await this.emDatastoreApiClient.getAlcoholMonitoringDetails(input, input.userToken)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
