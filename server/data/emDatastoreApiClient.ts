import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

export default class EmDatastoreApiClient extends RestClient {
  constructor(authenticationClient?: AuthenticationClient) {
    super('EM Datastore API', config.apis.emDatastoreApi, logger, authenticationClient)
  }
}
