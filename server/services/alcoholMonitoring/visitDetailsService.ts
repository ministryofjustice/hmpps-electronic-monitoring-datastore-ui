import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringVisitDetails } from '../../models/alcoholMonitoring/visitDetails'

export default class AlcoholMonitoringVisitDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getVisitDetails(input: OrderRequest): Promise<AlcoholMonitoringVisitDetails[]> {
    try {
      return await this.emDatastoreApiClient.getAlcoholMonitoringVisitDetails(input, input.userToken)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of visit details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
