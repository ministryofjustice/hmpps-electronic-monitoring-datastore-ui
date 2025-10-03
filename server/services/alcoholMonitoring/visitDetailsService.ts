import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringVisitDetails } from '../../data/models/alcoholMonitoringVisitDetails'

export default class AlcoholMonitoringVisitDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getVisitDetails(input: GetOrderRequest): Promise<AlcoholMonitoringVisitDetails[]> {
    try {
      const results = await this.emDatastoreApiClient.get<AlcoholMonitoringVisitDetails[]>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}/visit-details`,
        token: input.userToken,
      })

      return results.map(visitDetails => AlcoholMonitoringVisitDetails.parse(visitDetails))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of visit details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
