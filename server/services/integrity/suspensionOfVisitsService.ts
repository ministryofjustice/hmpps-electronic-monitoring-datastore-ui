import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'

import { OrderRequest } from '../../types/OrderRequest'
import {
  IntegritySuspensionOfVisitsEvent,
  IntegritySuspensionOfVisitsEventModel,
} from '../../models/integrity/suspensionOfVisits'

export default class IntegritySuspensionOfVisitsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getSuspensionOfVisits(input: OrderRequest): Promise<IntegritySuspensionOfVisitsEvent[]> {
    try {
      const results = await this.emDatastoreApiClient.get<IntegritySuspensionOfVisitsEvent[]>({
        path: `/orders/integrity/${input.legacySubjectId}/suspension-of-visits`,
        token: input.userToken,
      })

      return results.map(suspensionOfVisits => IntegritySuspensionOfVisitsEventModel.parse(suspensionOfVisits))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving suspension of visits data'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
