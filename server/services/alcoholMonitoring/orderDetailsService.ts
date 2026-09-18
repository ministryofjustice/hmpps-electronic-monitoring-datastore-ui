import { AlcoholMonitoringDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringOrderDetails } from '../../data/models/alcoholMonitoringOrderDetails'
import { ListSearchResultsRequest } from '../../models/requests/ListSearchResultsRequest'

export default class AlcoholMonitoringOrderDetailsService {
  constructor(private readonly alcoholMonitoringDatastoreClient: AlcoholMonitoringDatastoreClient) {}

  async getOrderDetails(input: GetOrderRequest): Promise<AlcoholMonitoringOrderDetails> {
    const { legacySubjectId, userToken } = input

    const result = await this.alcoholMonitoringDatastoreClient.getOrderDetails(legacySubjectId, userToken)

    return AlcoholMonitoringOrderDetails.parse(result)
  }

  async getSearchResults(input: ListSearchResultsRequest): Promise<AlcoholMonitoringOrderDetails[]> {
    const { queryExecutionId, userToken } = input

    const results = await this.alcoholMonitoringDatastoreClient.listOrderDetailsByQueryExecutionId(
      queryExecutionId,
      userToken,
    )

    return results.map(order => AlcoholMonitoringOrderDetails.parse(order))
  }
}
