import {
  defaultClient,
  DistributedTracingModes,
  getCorrelationContext,
  setup,
  type TelemetryClient,
} from 'applicationinsights'
import { Request, RequestHandler } from 'express'
import { TelemetryItem as EnvelopeTelemetry } from 'applicationinsights/out/src/declarations/generated'
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
    defaultClient.addTelemetryProcessor(parameterisePaths)
    defaultClient.addTelemetryProcessor(ignoredRequestsProcessor)
    defaultClient.addTelemetryProcessor(ignoredDependenciesProcessor)
    return defaultClient
  }
  return null
}

function parameterisePaths(
  envelope: EnvelopeTelemetry,
  contextObjects: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [name: string]: any
  },
) {
  const operationNameOverride = contextObjects.correlationContext?.customProperties?.getProperty('operationName')
  if (operationNameOverride) {
    /*  eslint-disable no-param-reassign */
    envelope.tags['ai.operation.name'] = operationNameOverride
    envelope.data.baseData.name = operationNameOverride
    /*  eslint-enable no-param-reassign */
  }
  return true
}

export function ignoredRequestsProcessor(envelope: EnvelopeTelemetry) {
  if (envelope.data?.baseType === 'RequestData') {
    const requestData = envelope.data.baseData
    if (requestData?.success) {
      const { name } = requestData
      return requestPrefixesToIgnore.every(prefix => !name?.startsWith(prefix))
    }
  }
  return true
}

export function ignoredDependenciesProcessor(envelope: EnvelopeTelemetry) {
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
