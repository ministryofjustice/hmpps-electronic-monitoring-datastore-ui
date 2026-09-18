import { AlcoholMonitoringDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringVisitDetails } from '../../data/models/alcoholMonitoringVisitDetails'

export default class AlcoholMonitoringVisitDetailsService {
  constructor(private readonly alcoholMonitoringDatastoreClient: AlcoholMonitoringDatastoreClient) {}

  async getVisitDetails(input: GetOrderRequest): Promise<AlcoholMonitoringVisitDetails[]> {
    const { legacySubjectId, userToken } = input
    const results = await this.alcoholMonitoringDatastoreClient.getVisitDetails(legacySubjectId, userToken)

    return results.map(visitDetails => AlcoholMonitoringVisitDetails.parse(visitDetails))
  }
}
