/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

// eslint-disable-next-line import/order
import { AuthenticationClient, RedisTokenStore, InMemoryTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { createRedisClient } from './redisClient'
import config from '../config'
import logger from '../../logger'
import HmppsAuditClient from './hmppsAuditClient'
import EmDatastoreApiClient from './emDatastoreApiClient'

export const dataAccess = () => ({
  applicationInfo,
  hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  emDatastoreApiClient: new EmDatastoreApiClient(
    new AuthenticationClient(
      config.apis.hmppsAuth,
      logger,
      config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
    ),
  ),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuditClient, EmDatastoreApiClient }
