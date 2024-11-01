import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orders from '../data/mockData/orders'
import { Order } from '../interfaces/order'
import RestClient from '../data/restClient'
import config, { ApiConfig } from '../config'

export default class SearchService {
  private readonly apiClient: RestClient

  constructor() {
    const token: string =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRwcy1jbGllbnQta2V5In0.eyJzdWIiOiJobXBwcy1lbGVjdHJvbmljLW1vbml0b3JpbmctZGF0YXN0b3JlLXVpLWNsaWVudCIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJzY29wZSI6WyJyZWFkIl0sImF1dGhfc291cmNlIjoibm9uZSIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTA5MC9hdXRoL2lzc3VlciIsImV4cCI6MTczMDQ2NTgwNSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9FTEVDVFJPTklDX01PTklUT1JJTkdfREFUQVNUT1JFX0FQSV9SRUFEIiwiUk9MRV9FTEVDVFJPTklDX01PTklUT1JJTkdfREFUQVNUT1JFX0FQSV9TRUFSQ0giXSwianRpIjoieG9ONW5ZckV6bEIxYkl6SkJ0MGhHZTI1cUQwIiwiY2xpZW50X2lkIjoiaG1wcHMtZWxlY3Ryb25pYy1tb25pdG9yaW5nLWRhdGFzdG9yZS11aS1jbGllbnQifQ.Nl4jrc8NPGfakk4ZTVxb5XDl4FN5sEyYjmkOYmQtsbl6t5S8GgOxddhtH7O2cOskPCUxa8LPQ63zqaNjGAHqyfRTPLJBwvPDNSkelF5nzN58TWgdvWN26yN9N8k39s_-TOUA8TEpZ4CoikQieGbQ-9wHXMfBD978R_MQXN7J7xgblA4WvSgsY6OjBECKIenuczGVHvINO_IyUEBfyxixEkOq0ENM0qr6BJlyxmqpHNu62eHrqbGEBhTw6d2F7jTt0LsJBks_rw-AEvvWlzu8FdPwimgcy0WPruTbJ6jl4IcSGV-cxWcBkQtMOS47vNyKdcWknANhVq2pqnoqo7jg0g'

    this.apiClient = new RestClient(
      'ElectronicMonitoringDatastoreApi',
      config.apis.electronicMonitoringDatastore as ApiConfig,
      token,
    )
  }

  async getOrders(): Promise<Order[]> {
    try {
      this.datastoreHealthTest()
      const caseId = '2'
      const apiResult = await this.callApi(caseId)

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
    const result = await this.apiClient.get({
      path: `/search/cases/${caseId}`,
    })

    return result
  }
}
