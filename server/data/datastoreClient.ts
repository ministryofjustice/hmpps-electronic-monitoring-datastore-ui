import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order, SearchCriteria } from '../interfaces/order'
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

  updateToken(newTokenValue: string): void {
    this.restClient.updateToken(newTokenValue)
  }

  async searchForOrders(critera: SearchCriteria): Promise<Order[]> {
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
}
