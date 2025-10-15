import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityServiceDetails } from '../../data/models/integrityServiceDetails'

export default class IntegrityServiceDetailService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getServiceDetails(input: GetOrderRequest): Promise<IntegrityServiceDetails[]> {
    const { restricted } = input

    try {
      const result = await this.emDatastoreApiClient.get<IntegrityServiceDetails[]>({
        path: `/orders/integrity/${input.legacySubjectId}/service-details`,
        query: { restricted },
        token: input.userToken,
      })

      return result.map(serviceDetails => IntegrityServiceDetails.parse(serviceDetails))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving service details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
