import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityVisitDetails } from '../../models/integrity/visitDetails'

export default class IntegrityVisitDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getVisitDetails(input: OrderRequest): Promise<IntegrityVisitDetails[]> {
    try {
      return await this.emDatastoreApiClient.getIntegrityVisitDetails(input, input.userToken)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of visit details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
