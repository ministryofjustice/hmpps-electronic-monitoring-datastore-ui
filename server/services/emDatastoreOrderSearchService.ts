import logger from '../../logger'
import getSanitisedError, { SanitisedError } from '../sanitisedError'
import { Order } from '../interfaces/order'
import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'

export default class EmDatastoreOrderSearchService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async submitSearchQuery(input: SearchFormInput): Promise<QueryExecutionResponse> {
    try {
      const queryExecutionId = await this.emDatastoreApiClient.submitSearchQuery(input, input.userToken)

      return queryExecutionId
    } catch (error) {
      const sanitisedError: SanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, 'Error submitting search query')
      sanitisedError.message = 'Error submitting search query'
      throw sanitisedError
    }
  }

  async getSearchResults(request: SearchResultsRequest): Promise<Order[]> {
    try {
      return await this.emDatastoreApiClient.getSearchResults(request, request.userToken)
    } catch (error) {
      let userFreindlyMessage = 'Error retrieving search results'
      const sanitisedError = getSanitisedError(error)

      const errorMessage: string | undefined = error.data?.developerMessage
      if (
        errorMessage &&
        errorMessage.includes('QueryExecution') &&
        errorMessage.includes('was not found (Service: Athena, Status Code: 400, Request ID:')
      ) {
        userFreindlyMessage += ': Invalid query execution ID'
      }

      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
