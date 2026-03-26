import {
  Contracts,
  defaultClient,
  DistributedTracingModes,
  getCorrelationContext,
  setup,
  TelemetryClient,
} from 'applicationinsights'
import { Request, RequestHandler } from 'express'
import { TelemetryItem as Envelope } from 'applicationinsights/out/src/declarations/generated'
import type { ApplicationInfo } from '../applicationInfo'

const requestPrefixesToIgnore = ['GET /assets/', 'GET /health', 'GET /ping', 'GET /info']
const dependencyPrefixesToIgnore = ['sqs']

export function initialiseAppInsights(): void {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
  }
}

export function buildAppInsightsClient(
  { applicationName, buildNumber }: ApplicationInfo,
  overrideName?: string,
): TelemetryClient {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags['ai.cloud.role'] = overrideName || applicationName
    defaultClient.context.tags['ai.application.ver'] = buildNumber

    defaultClient.addTelemetryProcessor(({ tags, data }, contextObjects) => {
      const operationNameOverride = contextObjects?.correlationContext?.customProperties?.getProperty('operationName')
      if (operationNameOverride) {
        // eslint-disable-next-line no-param-reassign,no-multi-assign
        tags['ai.operation.name'] = data.baseData.name = operationNameOverride
      }
      return true
    })

    defaultClient.addTelemetryProcessor(ignoredRequestsProcessor)
    defaultClient.addTelemetryProcessor(ignoredDependenciesProcessor)

    return defaultClient
  }
  return null
}

export function ignoredRequestsProcessor(envelope: Envelope) {
  if (envelope.data?.baseType === 'RequestData') {
    const requestData = envelope.data.baseData
    if (requestData?.success) {
      const { name } = requestData
      return requestPrefixesToIgnore.every(prefix => !name?.startsWith(prefix))
    }
  }
  return true
}

export function ignoredDependenciesProcessor(envelope: Envelope) {
  if (envelope.data?.baseType === 'RemoteDependencyData') {
    const dependencyData = envelope.data.baseData
    if (dependencyData?.success) {
      const { target } = dependencyData
      return dependencyPrefixesToIgnore.every(prefix => !target?.startsWith(prefix))
    }
  }
  return true
}

export function appInsightsMiddleware(): RequestHandler {
  return (req: Request, res, next) => {
    res.prependOnceListener('finish', () => {
      const context = getCorrelationContext()
      if (context && req.route) {
        context.customProperties.setProperty('operationName', `${req.method} ${req.route?.path}`)
      }
    })
    next()
  }
}
