import RestClient from './restClient'
import { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'

export default class EmDatastoreApiClient extends RestClient {
  constructor(apiConfig: ApiConfig) {
    super('emDatastoreApiClient', apiConfig)
  }

  async submitSearchQuery(input: SearchFormInput, _: string): Promise<QueryExecutionResponse> {
    return this.post<QueryExecutionResponse>({
      path: '/orders',
      data: input.data,
      token: input.userToken,
    })
  }

  async getSearchResults(input: SearchResultsRequest, _: string): Promise<Order[]> {
    return this.get<Order[]>({
      path: `/orders?id=${input.queryExecutionId}`,
      token: input.userToken,
    })
  }
}
