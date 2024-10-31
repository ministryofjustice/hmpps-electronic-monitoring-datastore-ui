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

import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'
import RedisTokenStore from './tokenStore/redisTokenStore'
import InMemoryTokenStore from './tokenStore/inMemoryTokenStore'
import config, { ApiConfig } from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import RestClient from './restClient'

type RestClientBuilder<T> = (token: string) => T

// const jaspersToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRwcy1jbGllbnQta2V5In0.eyJzdWIiOiJobXBwcy1lbGVjdHJvbmljLW1vbml0b3JpbmctZGF0YXN0b3JlLXVpLWNsaWVudCIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJzY29wZSI6WyJyZWFkIl0sImF1dGhfc291cmNlIjoibm9uZSIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTA5MC9hdXRoL2lzc3VlciIsImV4cCI6MTczMDM5NjA5NSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9FTEVDVFJPTklDX01PTklUT1JJTkdfREFUQVNUT1JFX0FQSV9SRUFEIiwiUk9MRV9FTEVDVFJPTklDX01PTklUT1JJTkdfREFUQVNUT1JFX0FQSV9TRUFSQ0giXSwianRpIjoiMFJ1X2xYYzY0cWJ6ZVpsV2VaQXhmeEs1TVVzIiwiY2xpZW50X2lkIjoiaG1wcHMtZWxlY3Ryb25pYy1tb25pdG9yaW5nLWRhdGFzdG9yZS11aS1jbGllbnQifQ.DjS0vtfvFLr6METDhClh3YxPDsd-M16Sv98LhT3ZCeX9vWRcST0ti1uXJeGZxqlZ1MUWckFJug5qhTfrbxFsWmkwcXsr690ALFiIyh00Ym3Xvgv_HeTi1JzgZaIqj8h7pryUY6YReu8m89eBuyvr9k4xICtYkbgM5wOWnJDifhQFOsyq7gg7oTsJgBwYqSZ9t7esyI5197sx820pyTqV_21M9Jq0xzF4py1-IoZJNVctIhQ_t9NvJcIs_mMg6rdA4amWqqKb4cM6qeQuhNSxo3arJ5LoA13L23o2NSFKZVMSaJjljuvpUZzm7hi3oALs4rsf1tHjo1Mds4zuvHUFZw'
export const dataAccess = () => ({
  applicationInfo,
  // hmppsAuthClient: new HmppsAuthClient(
  //   config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  // ),
  hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  datastoreApi: new RestClient('ElectronicMonitoringDatastoreApi', config.apis.electronicMonitoringDatastore as ApiConfig)
})

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, RestClientBuilder, HmppsAuditClient }
