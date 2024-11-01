import logger from '../../logger'
import getSanitisedError from '../sanitisedError'
import orders from '../data/mockData/orders'
import { Order } from '../interfaces/order'
import RestClient from '../data/restClient'
import config, { ApiConfig } from '../config'
import { HmppsAuthClient } from '../data'

export default class SearchService {
  private readonly apiClient: RestClient
  public datastoreClientToken: string = 'unset'

  constructor(private readonly authClient: HmppsAuthClient) {
    this.getSystemClientToken()

    this.apiClient = new RestClient(
      'ElectronicMonitoringDatastoreApi',
      config.apis.electronicMonitoringDatastore as ApiConfig,
      this.datastoreClientToken,
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
  async getSystemClientToken() {
    // this.datastoreClientToken = await this.authClient.getSystemClientToken()
    this.datastoreClientToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRwcy1jbGllbnQta2V5In0.eyJzdWIiOiJobXBwcy1lbGVjdHJvbmljLW1vbml0b3JpbmctZGF0YXN0b3JlLXVpLWNsaWVudCIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJzY29wZSI6WyJyZWFkIl0sImF1dGhfc291cmNlIjoibm9uZSIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTA5MC9hdXRoL2lzc3VlciIsImV4cCI6MTczMDQ4MDQ2NCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9FTEVDVFJPTklDX01PTklUT1JJTkdfREFUQVNUT1JFX0FQSV9SRUFEIiwiUk9MRV9FTEVDVFJPTklDX01PTklUT1JJTkdfREFUQVNUT1JFX0FQSV9TRUFSQ0giXSwianRpIjoiTldnUzY0ZnBkZTZ1MU5xOHdncHZvN3ExWnFNIiwiY2xpZW50X2lkIjoiaG1wcHMtZWxlY3Ryb25pYy1tb25pdG9yaW5nLWRhdGFzdG9yZS11aS1jbGllbnQifQ.j_NOPO-btiU4uvM2-JkQM1FqAMP5MDyXAVge4cKLh4b0laMyxE0g_KyEfoQvA8Exo-NrxNeWaM3WbWjNf0-A02X9zYOT3kFLFfWVJUQd1bmSddlMsaspF_7HqNONuY4QoowN21muw9No9B9MRPN7BItEWyQvWnkspyIIyK-KOUuU1-A0IdhN5EgrztWivS4Mlat_qQg4pxro3CvsrmH4Zf465ndtUTpIHnE0sKa4NPPhQvf6bqnkuBczeAWg8jROMK4SO8_ExBxprUScoQpxZNvvTtDQ8OGqwznnLub0O5epp1fJVrjMy2ZjHZ8ZpzKLndnlUx6-RYgBvm1iwr2oVg"
  }

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
    const result = await this.apiClient.get({
      path: `/search/cases/${caseId}`,
    })

    return result
  }
}
