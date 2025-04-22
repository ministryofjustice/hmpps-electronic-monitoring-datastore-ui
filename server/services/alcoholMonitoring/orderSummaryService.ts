import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import {
  AlcoholMonitoringOrderSummary,
  AlcoholMonitoringOrderSummaryModel,
} from '../../models/alcoholMonitoring/orderSummary'

export default class AlcoholMonitoringOrderSummaryService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getOrderSummary(input: OrderRequest): Promise<AlcoholMonitoringOrderSummary> {
    try {
      const result = await this.emDatastoreApiClient.get<AlcoholMonitoringOrderSummary>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}`,
        token: input.userToken,
      })

      return AlcoholMonitoringOrderSummaryModel.parse(result)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order summary'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
