import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import {
  AlcoholMonitoringOrderDetails,
  AlcoholMonitoringOrderDetailsModel,
} from '../../models/alcoholMonitoring/orderDetails'

export default class AlcoholMonitoringDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getOrderDetails(input: OrderRequest): Promise<AlcoholMonitoringOrderDetails> {
    try {
      const result = await this.emDatastoreApiClient.get<AlcoholMonitoringOrderDetails>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}`,
        token: input.userToken,
      })

      return AlcoholMonitoringOrderDetailsModel.parse(result)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
