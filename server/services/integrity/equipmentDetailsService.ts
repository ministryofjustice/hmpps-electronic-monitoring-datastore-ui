import { IntegrityDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityEquipmentDetails } from '../../data/models/integrityEquipmentDetails'

export default class IntegrityEquipmentDetailsService {
  constructor(private readonly integrityDatastoreClient: IntegrityDatastoreClient) {}

  async getEquipmentDetails(input: GetOrderRequest): Promise<IntegrityEquipmentDetails[]> {
    const { restricted } = input

    const results = await this.integrityDatastoreClient.getEquipmentDetails(
      input.legacySubjectId,
      input.userToken,
      restricted,
    )

    return results.map(equipmentDetails => IntegrityEquipmentDetails.parse(equipmentDetails))
  }
}
