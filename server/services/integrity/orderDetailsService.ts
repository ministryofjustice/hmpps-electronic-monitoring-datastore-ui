import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'
import { ListSearchResultsRequest } from '../../models/requests/ListSearchResultsRequest'

export default class IntegrityOrderDetailsService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getOrderDetails(input: GetOrderRequest): Promise<IntegrityOrderDetails> {
    try {
      const result = await this.emDatastoreApiClient.get<IntegrityOrderDetails>({
        path: `/orders/integrity/${input.legacySubjectId}`,
        token: input.userToken,
      })

      return IntegrityOrderDetails.parse(result)
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving order details'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  async getSearchResults(input: ListSearchResultsRequest): Promise<IntegrityOrderDetails[]> {
    try {
      const results = await this.emDatastoreApiClient.get<IntegrityOrderDetails[]>({
        path: `/orders/integrity?id=${input.queryExecutionId}`,
        token: input.userToken,
      })

      return results.map(order => IntegrityOrderDetails.parse(order))
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
