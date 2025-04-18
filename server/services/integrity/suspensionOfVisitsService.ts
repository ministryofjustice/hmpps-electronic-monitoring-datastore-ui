import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegritySuspensionOfVisitsEvent } from '../../models/integrity/suspensionOfVisits'

export default class IntegritySuspensionOfVisitsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getSuspensionOfVisits(input: OrderRequest): Promise<IntegritySuspensionOfVisitsEvent[]> {
    try {
      return await this.emDatastoreApiClient.getSuspensionOfVisits(input, input.userToken)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving suspension of visits data'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
