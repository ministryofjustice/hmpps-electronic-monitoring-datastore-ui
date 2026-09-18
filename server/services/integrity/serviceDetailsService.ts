import { IntegrityDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityServiceDetails } from '../../data/models/integrityServiceDetails'

export default class IntegrityServiceDetailService {
  constructor(private readonly integrityDatastoreClient: IntegrityDatastoreClient) {}

  async getServiceDetails(input: GetOrderRequest): Promise<IntegrityServiceDetails[]> {
    const { legacySubjectId, userToken, restricted } = input

    const result = await this.integrityDatastoreClient.getServiceDetails(legacySubjectId, userToken, restricted)
    return result.map(serviceDetails => IntegrityServiceDetails.parse(serviceDetails))
  }
}
