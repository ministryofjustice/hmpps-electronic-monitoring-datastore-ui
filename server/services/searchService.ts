import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orders from '../data/mockData/orders'
import { Order } from '../interfaces/order'
import RestClient from '../data/restClient'
import config, { ApiConfig } from '../config'
import { HmppsAuthClient } from '../data'

export default class SearchService {
  private readonly apiClient: RestClient

  constructor(
    private readonly authClient: HmppsAuthClient,
    private readonly datastoreClient: RestClient
  ) {
    // this.apiClient = new RefreshableRestClient(
    //   'ElectronicMonitoringDatastoreApi',
    //   config.apis.electronicMonitoringDatastore as ApiConfig,
    //   authClient
    // )

    this.apiClient = new RestClient(
      'ElectronicMonitoringDatastoreApi',
      config.apis.electronicMonitoringDatastore as ApiConfig,
      'token not set'
    )
  }
  
  /*
  This line (26) worked about an hour before we committed, but it broke

  Getting a refresh token:
  When calling the API... call authClient.getSystemClientToken()
  Compoare this to the systemClientToken we have already.
  if it's different: re-instantiate the apiClient with the new token value.

  Ideally we'd not reinstantiate the client and just pass tokens in with the requests, but this should at least work.

  Also, need to un-break the tests!
  */

  async getOrders(): Promise<Order[]> {
    try {
      this.datastoreHealthTest()
      const caseId = '2'
      const apiResult = await this.callApi(caseId)

      orders[0].name = JSON.stringify(apiResult)
      return orders
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving search results')
      return error
    }
  }

  async datastoreHealthTest() {
    const myConfig = config.apis.electronicMonitoringDatastore as ApiConfig
    myConfig.url = 'http://localhost:8080'
    const dsApi = new RestClient('myApi', config.apis.electronicMonitoringDatastore as ApiConfig, '')

    const result = await dsApi.unauthorised_get({
      path: '/health',
    })

    return result
  }

  async callApi(caseId: string) {
    this.apiClient.refreshToken(await this.authClient.getSystemClientToken())
    const result = await this.apiClient.get({
      path: `/search/cases/${caseId}`,
    })

    return result
  }
}
