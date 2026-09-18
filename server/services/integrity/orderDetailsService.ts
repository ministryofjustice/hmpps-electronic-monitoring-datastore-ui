import { IntegrityDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityOrderDetails } from '../../data/models/integrityOrderDetails'
import { ListSearchResultsRequest } from '../../models/requests/ListSearchResultsRequest'

export default class IntegrityOrderDetailsService {
  constructor(private readonly integrityDatastoreClient: IntegrityDatastoreClient) {}

  async getOrderDetails(input: GetOrderRequest): Promise<IntegrityOrderDetails> {
    const { legacySubjectId, userToken, restricted } = input

    const result = await this.integrityDatastoreClient.getOrderDetails(legacySubjectId, userToken, restricted)

    return IntegrityOrderDetails.parse(result)
  }

  async getSearchResults(input: ListSearchResultsRequest): Promise<IntegrityOrderDetails[]> {
    const { queryExecutionId, userToken, restricted } = input

    const results = await this.integrityDatastoreClient.listOrderDetailsByQueryExecutionId(
      queryExecutionId,
      userToken,
      restricted,
    )

    return results.map((order: unknown) => IntegrityOrderDetails.parse(order))
  }
}
