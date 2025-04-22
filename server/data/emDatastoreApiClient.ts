import RestClient from './restClient'
import { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'
import { OrderRequest } from '../types/OrderRequest'

import { IntegrityOrderSummary } from '../models/integrity/orderSummary'
import { IndegrityOrderDetails } from '../interfaces/integrity/orderDetails'

import { AlcoholMonitoringOrderSummary } from '../models/alcoholMonitoring/orderSummary'
import { AlcoholMonitoringOrderDetails } from '../models/alcoholMonitoring/orderDetails'

export default class EmDatastoreApiClient extends RestClient {
  constructor(apiConfig: ApiConfig) {
    super('emDatastoreApiClient', apiConfig)
  }

  async submitSearchQuery(input: SearchFormInput, token: string): Promise<QueryExecutionResponse> {
    const { data } = input
    return this.post<QueryExecutionResponse>({
      path: '/orders',
      data,
      token,
    })
  }

  async getSearchResults(request: SearchResultsRequest, token: string): Promise<Order[]> {
    const { queryExecutionId } = request
    return this.get<Order[]>({
      path: `/orders?id=${queryExecutionId}`,
      token,
    })
  }

  async confirmApi(token: string): Promise<JSON> {
    return this.get<JSON>({
      path: '/test',
      token,
    })
  }

  async getIntegrityDetails(input: OrderRequest, token: string): Promise<IndegrityOrderDetails> {
    const { legacySubjectId } = input
    return this.get<IndegrityOrderDetails>({
      path: `/orders/integrity/${legacySubjectId}/details`,
      token,
    })
  }

  async getAlcoholMonitoringDetails(input: OrderRequest, token: string): Promise<AlcoholMonitoringOrderDetails> {
    const { legacySubjectId } = input
    return this.get<AlcoholMonitoringOrderDetails>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/details`,
      token,
    })
  }
}
