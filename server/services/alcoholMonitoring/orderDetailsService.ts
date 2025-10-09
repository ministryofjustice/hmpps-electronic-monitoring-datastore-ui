import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'
import { ListSearchResultsRequest } from '../../models/requests/ListSearchResultsRequest'

export default class AlcoholMonitoringDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getOrderDetails(input: GetOrderRequest): Promise<AlcoholMonitoringOrderDetails> {
    try {
      const result = await this.emDatastoreApiClient.get<AlcoholMonitoringOrderDetails>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}`,
        token: input.userToken,
      })

      return AlcoholMonitoringOrderDetails.parse(result)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  async getSearchResults(input: ListSearchResultsRequest): Promise<AlcoholMonitoringOrderDetails[]> {
    try {
      const results = await this.emDatastoreApiClient.get<AlcoholMonitoringOrderDetails[]>({
        path: `/orders/alcohol-monitoring?id=${input.queryExecutionId}`,
        token: input.userToken,
      })

      return results.map(order => AlcoholMonitoringOrderDetails.parse(order))
    } catch (error) {
      let userFriendlyMessage = 'Error retrieving search results'
      const sanitisedError = getSanitisedError(error)

      const errorMessage: string | undefined = error.data?.developerMessage
      if (
        errorMessage &&
        errorMessage.includes('QueryExecution') &&
        errorMessage.includes('was not found (Service: Athena, Status Code: 400, Request ID:')
      ) {
        userFriendlyMessage += ': Invalid query execution ID'
      }

      logger.error(sanitisedError, userFriendlyMessage)
      sanitisedError.message = `${userFriendlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
