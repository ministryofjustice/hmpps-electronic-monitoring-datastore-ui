// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response } from 'superagent'
import RestClient from './restClient'
import config from '../config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function restClient(token?: string): RestClient {
  return new RestClient('Make recall decision API Client', config.apis.datastoreApi, token)
}
