import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import orders from './mockData/orders'

export default class DatastoreClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'datastoreApiClient',
      config.apis.electronicMonitoringDatastore as ApiConfig,
      token,
    )
  }

  /* We will have a method here as follows to allow the token in the Rest client to be updated. */
  // updateToken(newTokenValue: string): void {
  //   this.restClient.updateToken(newTokenValue);
  // }

  async getOrders(): Promise<Order[]> {
    return orders
  }

  /* OR, we will update the token as part of each call.
     We can't do this until the RestClient is injected, or we use nock */
  // async getOrders(token: string): Promise<Order[]> {
  //   this.restClient.updateToken(token);

  //   return await this.restClient.get<Order[]>({
  //     path: `/fake/url/path`,
  //     query: new URLSearchParams({
  //       term: 'search string',
  //       otherParameter: "yes",
  //     }).toString(),
  //   })
  // }
}
