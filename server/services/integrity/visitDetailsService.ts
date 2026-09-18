import { IntegrityDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityVisitDetails } from '../../data/models/integrityVisitDetails'

export default class IntegrityVisitDetailsService {
  constructor(private readonly integrityDatastoreClient: IntegrityDatastoreClient) {}

  async getVisitDetails(input: GetOrderRequest): Promise<IntegrityVisitDetails[]> {
    const { legacySubjectId, userToken, restricted } = input

    const results = await this.integrityDatastoreClient.getVisitDetails(legacySubjectId, userToken, restricted)

    return results.map(visitDetails => IntegrityVisitDetails.parse(visitDetails))
  }
}
