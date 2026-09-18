import { AlcoholMonitoringDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringServiceDetails } from '../../data/models/alcoholMonitoringServiceDetails'

export default class AlcoholMonitoringServiceDetailService {
  constructor(private readonly alcoholMonitoringDatastoreClient: AlcoholMonitoringDatastoreClient) {}

  async getServiceDetails(input: GetOrderRequest): Promise<AlcoholMonitoringServiceDetails[]> {
    const { legacySubjectId, userToken } = input

    const results = await this.alcoholMonitoringDatastoreClient.getServiceDetails(legacySubjectId, userToken)

    return results.map(serviceDetails => AlcoholMonitoringServiceDetails.parse(serviceDetails))
  }
}
