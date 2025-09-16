import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import EmDatastoreApiClient from '../../data/emDatastoreApiClient'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegritySuspensionOfVisits } from '../../data/models/integritySuspensionOfVisits'

export default class IntegritySuspensionOfVisitsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getSuspensionOfVisits(input: GetOrderRequest): Promise<IntegritySuspensionOfVisits[]> {
    try {
      const results = await this.emDatastoreApiClient.get<IntegritySuspensionOfVisits[]>({
        path: `/orders/integrity/${input.legacySubjectId}/suspension-of-visits`,
        token: input.userToken,
      })

      return results.map(suspensionOfVisits => IntegritySuspensionOfVisits.parse(suspensionOfVisits))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving suspension of visits data'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
