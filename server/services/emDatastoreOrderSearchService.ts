import logger from '../../logger'
import getSanitisedError, { SanitisedError } from '../sanitisedError'
import { Order, OrderModel } from '../models/order'
import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'
import { QueryExecutionResponse, QueryExecutionResponseModel } from '../models/queryExecutionResponse'

export default class EmDatastoreOrderSearchService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async submitSearchQuery(input: SearchFormInput): Promise<QueryExecutionResponse> {
    try {
      const result = await this.emDatastoreApiClient.post<QueryExecutionResponse>({
        path: '/orders',
        data: input.data,
        token: input.userToken,
      })

      return QueryExecutionResponseModel.parse(result)
    } catch (error) {
      const sanitisedError: SanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, 'Error submitting search query')
      sanitisedError.message = 'Error submitting search query'
      throw sanitisedError
    }
  }

  async getSearchResults(input: SearchResultsRequest): Promise<Order[]> {
    try {
      const results = await this.emDatastoreApiClient.get<Order[]>({
        path: `/orders?id=${input.queryExecutionId}`,
        token: input.userToken,
      })

      return results.map(order => OrderModel.parse(order))
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
