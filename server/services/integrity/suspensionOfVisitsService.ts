import { IntegrityDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegritySuspensionOfVisits } from '../../data/models/integritySuspensionOfVisits'

export default class IntegritySuspensionOfVisitsService {
  constructor(private readonly integrityDatastoreClient: IntegrityDatastoreClient) {}

  async getSuspensionOfVisits(input: GetOrderRequest): Promise<IntegritySuspensionOfVisits[]> {
    const { legacySubjectId, userToken, restricted } = input

    const results = await this.integrityDatastoreClient.getSuspensionOfVisits(legacySubjectId, userToken, restricted)

    return results.map(suspensionOfVisits => IntegritySuspensionOfVisits.parse(suspensionOfVisits))
  }
}
