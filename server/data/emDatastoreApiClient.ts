import RestClient from './restClient'
import { ApiConfig } from '../config'

export default class EmDatastoreApiClient extends RestClient {
  constructor(apiConfig: ApiConfig) {
    super('emDatastoreApiClient', apiConfig)
  }
}
