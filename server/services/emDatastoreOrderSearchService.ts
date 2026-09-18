import { IntegrityDatastoreClient } from '../data'

import { OrderSearchCriteria } from '../data/models/orderSearchCriteria'
import { QueryExecutionResponse } from '../models/queryExecutionResponse'

export default class EmDatastoreOrderSearchService {
  constructor(private readonly integrityDatastoreClient: IntegrityDatastoreClient) {}

  async submitSearchQuery(
    searchType: string,
    data: OrderSearchCriteria,
    userToken: string,
  ): Promise<QueryExecutionResponse> {
    const result = await this.integrityDatastoreClient.runSearchQuery(searchType, data, userToken)
    return QueryExecutionResponse.parse(result)
  }
}
