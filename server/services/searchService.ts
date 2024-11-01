import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orders from '../data/mockData/orders'
import { Order } from '../interfaces/order'
import RestClient from '../data/restClient'
import config, { ApiConfig } from '../config'

export default class SearchService {
  private readonly apiClient: RestClient

  constructor() {
    const token: string = '123'
    this.apiClient = new RestClient(
      'ElectronicMonitoringDatastoreApi',
      config.apis.electronicMonitoringDatastore as ApiConfig,
      token,
    )
  }

  async getOrders(): Promise<Order[]> {
    try {
      this.flaskEndpointTest()
      this.datastoreApiTest()
      this.datastoreApiTestAuthorised()

      return orders
    } catch (error) {
      logger.error(getSanitisedError(error), 'Error retrieving search results')
      return error
    }
  }

  async flaskEndpointTest() {
    const result = await this.apiClient.get({
      path: '/',
    })

    return result
  }

  async datastoreApiTest() {
    const myConfig = config.apis.electronicMonitoringDatastore as ApiConfig
    myConfig.url = 'http://localhost:8080'
    const dsApi = new RestClient('myApi', config.apis.electronicMonitoringDatastore as ApiConfig, '')

    const result = await dsApi.unauthorised_get({
      path: '/health',
    })

    return result
  }

  async datastoreApiTestAuthorised() {
    const myConfig = config.apis.electronicMonitoringDatastore as ApiConfig
    myConfig.url = 'http://localhost:8080'
    const myToken: string =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRwcy1jbGllbnQta2V5In0.eyJzdWIiOiJobXBwcy1lbGVjdHJvbmljLW1vbml0b3JpbmctZGF0YXN0b3JlLXVpLWNsaWVudCIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJzY29wZSI6WyJyZWFkIl0sImF1dGhfc291cmNlIjoibm9uZSIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTA5MC9hdXRoL2lzc3VlciIsImV4cCI6MTczMDQ2MjE2MywiYXV0aG9yaXRpZXMiOlsiUk9MRV9FTEVDVFJPTklDX01PTklUT1JJTkdfREFUQVNUT1JFX0FQSV9SRUFEIiwiUk9MRV9FTEVDVFJPTklDX01PTklUT1JJTkdfREFUQVNUT1JFX0FQSV9TRUFSQ0giXSwianRpIjoiblRvby13dlFoNUNoZjB2UkdIaW1hZERWN3FzIiwiY2xpZW50X2lkIjoiaG1wcHMtZWxlY3Ryb25pYy1tb25pdG9yaW5nLWRhdGFzdG9yZS11aS1jbGllbnQifQ.j1yTcdJH9Q_11f2k8FMuw3JCVyKTQYsHFswzvqoMivdryRFSNXOFNtUokt2EzfiGWZ1hYbmm6i0mLcvyfPjH6KqnGwt4gxZybEERIUImXAHyst-kcOZ2WVHb5Xt4TxK9oIUKwHX35XQS6xPtdkAU3jxehwbrixf5JTcGeKDkDGGPOlWuPu2AjMcpvQiWCu7O9fygz9kDaasfV6ju-nmPwp56pLEFM_JB7_dKlnmq7tu1snuXtCoknRioeww_YcgGs9yhOL-KaVJnzgAXkvfYZPTMoZpUM61KFIg026SeVBGPeb0JwJGVYg47TiX6fbnluSh5xBfBiKckuXVbWy10vg'
    const dsApi = new RestClient('myApi', config.apis.electronicMonitoringDatastore as ApiConfig, myToken)

    const result = await dsApi.get({
      path: '/search/cases/1',
    })

    return result
  }
}
