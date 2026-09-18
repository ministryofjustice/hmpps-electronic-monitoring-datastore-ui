import { AlcoholMonitoringDatastoreClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringEquipmentDetails } from '../../data/models/alcoholMonitoringEquipmentDetails'

export default class AlcoholMonitoringEquipmentDetailsService {
  constructor(private readonly alcoholMonitoringDatastoreApiClient: AlcoholMonitoringDatastoreClient) {}

  async getEquipmentDetails(input: GetOrderRequest): Promise<AlcoholMonitoringEquipmentDetails[]> {
    const { legacySubjectId, userToken } = input
    const result = await this.alcoholMonitoringDatastoreApiClient.getEquipmentDetails(legacySubjectId, userToken)

    return result.map((equipmentDetails: unknown) => AlcoholMonitoringEquipmentDetails.parse(equipmentDetails))
  }
}
