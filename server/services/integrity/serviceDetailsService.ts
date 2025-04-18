import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityServiceDetail } from '../../models/integrity/serviceDetail'

export default class IntegrityServiceDetailService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getServiceDetails(input: OrderRequest): Promise<IntegrityServiceDetail[]> {
    try {
      return await this.emDatastoreApiClient.get<IntegrityServiceDetail[]>({
        path: `/orders/integrity/${input.legacySubjectId}/service-details`,
        token: input.userToken,
      })
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving service details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
