import logger from '../../logger'
import getSanitisedError, { SanitisedError } from '../sanitisedError'
import EmDatastoreApiClient from '../data/emDatastoreApiClient'
import { OrderSearchRequest } from '../models/requests/SearchOrdersRequest'
import { QueryExecutionResponse } from '../models/queryExecutionResponse'

export default class EmDatastoreOrderSearchService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async submitSearchQuery(input: OrderSearchRequest): Promise<QueryExecutionResponse> {
    const { data, userToken } = input
    const { searchType } = data

    try {
      const result = await this.emDatastoreApiClient.post<QueryExecutionResponse>({
        path: `/orders/${searchType}`,
        data,
        token: userToken,
      })

      return QueryExecutionResponse.parse(result)
    } catch (error) {
      const sanitisedError: SanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, 'Error submitting search query')
      sanitisedError.message = 'Error submitting search query'
      throw sanitisedError
    }
  }
}
