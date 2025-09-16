import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringServiceDetails } from '../../data/models/alcoholMonitoringServiceDetails'

export default class AlcoholMonitoringServiceDetailService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getServiceDetails(input: GetOrderRequest): Promise<AlcoholMonitoringServiceDetails[]> {
    try {
      const results = await this.emDatastoreApiClient.get<AlcoholMonitoringServiceDetails[]>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}/service-details`,
        token: input.userToken,
      })

      return results.map(serviceDetails => AlcoholMonitoringServiceDetails.parse(serviceDetails))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving service details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
