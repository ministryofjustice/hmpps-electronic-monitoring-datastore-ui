import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityServiceDetails, IntegrityServiceDetailsModel } from '../../models/integrity/serviceDetails'

export default class IntegrityServiceDetailService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getServiceDetails(input: OrderRequest): Promise<IntegrityServiceDetails[]> {
    try {
      const result = await this.emDatastoreApiClient.get<IntegrityServiceDetails[]>({
        path: `/orders/integrity/${input.legacySubjectId}/service-details`,
        token: input.userToken,
      })

      return result.map(serviceDetails => IntegrityServiceDetailsModel.parse(serviceDetails))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving service details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
