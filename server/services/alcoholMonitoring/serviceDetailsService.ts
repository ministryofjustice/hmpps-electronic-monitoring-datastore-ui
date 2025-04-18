import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringServiceDetails } from '../../models/alcoholMonitoring/serviceDetails'

export default class AlcoholMonitoringServiceDetailService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getServiceDetails(input: OrderRequest): Promise<AlcoholMonitoringServiceDetails[]> {
    try {
      return await this.emDatastoreApiClient.getAlcoholMonitoringServiceDetails(input, input.userToken)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving service details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
