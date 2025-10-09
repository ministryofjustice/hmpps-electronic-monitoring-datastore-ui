import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityVisitDetails } from '../../data/models/integrityVisitDetails'

export default class IntegrityVisitDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getVisitDetails(input: GetOrderRequest): Promise<IntegrityVisitDetails[]> {
    const { restricted } = input

    try {
      const results = await this.emDatastoreApiClient.get<IntegrityVisitDetails[]>({
        path: `/orders/integrity/${input.legacySubjectId}/visit-details`,
        query: { restricted },
        token: input.userToken,
      })

      return results.map(visitDetails => IntegrityVisitDetails.parse(visitDetails))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of visit details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
