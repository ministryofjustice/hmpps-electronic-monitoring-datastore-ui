import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import orders from './mockData/orders'
import { SearchFormInput } from '../types/SearchFormInput'

export default class DatastoreClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'datastoreApiClient',
      config.apis.electronicMonitoringDatastore as ApiConfig,
      token,
    )
  }

  updateToken(newTokenValue: string): void {
    this.restClient.updateToken(newTokenValue)
  }

  // TODO: This should replace SearchForOrders
  async searchOrders(input: SearchFormInput): Promise<Order[]> {
    const { userToken, data } = input

    const headers = {
      'X-User-Token': userToken ?? null,
    }

    const results: Order[] = await this.restClient.post<Order[]>({
      path: `/search/orders`,
      headers,
      data,
    })

    return results
  }

  async searchForOrders(critera: Order): Promise<Order[]> {
    // TODO: This method should be a post. criteria will be validated search formdata
    // const results: Order[] = await this.restClient.get({
    //   path: `ADD_CORRECT_PATH/criteria-object-here`,
    // })

    // TODO: return results from commented out API call, once API endpoint has been written
    return orders
  }

  async getCases(critera: Order): Promise<Order> {
    const result: Order = await this.restClient.get({
      path: `/search/cases/${critera.legacySubjectId}`,
    })

    return result
  }

  async confirmApi(orderParameter: string): Promise<JSON> {
    const result: JSON = await this.restClient.get({
      path: `/search/cases/${orderParameter}`,
    })

    return result
  }

  // TODO: DO this when other end points have been fleshed out here

  // // TODO: have a generic get and post in the client, with route-specific logic in the Service?
  // async get<T>(path: string, token: String): Promise<T>{
  // updateToken(token)
  // return this.restClient.get(path)
  // }
  //
}
