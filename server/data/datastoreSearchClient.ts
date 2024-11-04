import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import orders from './mockData/orders'

export default class DatastoreSearchClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'datastoreSearchApiClient',
      config.apis.electronicMonitoringDatastore as ApiConfig,
      token,
    )
  }

  async getOrders(): Promise<Order[]> {
    return orders
  }
}
