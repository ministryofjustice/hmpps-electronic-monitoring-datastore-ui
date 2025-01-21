import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import orders from './mockData/orders'
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

  // TODO: This should replace SearchForOrders
  async searchOrders(input: SearchFormInput): Promise<Order[]> {
    const { data } = input

    const results: Order[] = await this.restClient.post<Order[]>({
      path: `/search/orders`,
      data,
    })

    return results
  }

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
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

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  async confirmApi(orderParameter: string): Promise<JSON> {
    const result: JSON = await this.restClient.get({
      path: `/search/confirmConnection`,
    })

    return result
  }

  async getOrderSummary(input: OrderRequest): Promise<OrderInformation> {
    const { orderId } = input

    const result: OrderInformation = await this.restClient.get({
      path: `/orders/getOrderSummary/${orderId}`,
    })

    return result
  }
}
