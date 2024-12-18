import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import { SearchFormInput } from '../types/SearchFormInput'
import { OrderRequest } from '../types/OrderRequest'
import { OrderInformation } from '../interfaces/orderInformation'

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

  async searchOrders(input: SearchFormInput): Promise<Order[]> {
    const { data } = input

    const results: Order[] = await this.restClient.post<Order[]>({
      path: `/search/orders`,
      data,
    })

    return results
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

  async getOrderSummary(input: OrderRequest): Promise<OrderInformation> {
    const { userToken, orderId } = input

    const headers = {
      'X-User-Token': userToken ?? null,
    }

    const result: OrderInformation = await this.restClient.get({
      path: `/orders/getOrderSummary/${orderId}`,
      headers,
    })

    return result
  }
}
