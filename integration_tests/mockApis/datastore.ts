import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const defaultGetMonitoringEventsOptions = {
  httpStatus: 200,
  orderId: '123456789',
  events: [] as unknown[],
} as GetMonitoringEventsStubOptions

type GetMonitoringEventsStubOptions = {
  httpStatus: number
  orderId?: string
  events?: unknown[]
}

const getMonitoringEvents = (
  options: GetMonitoringEventsStubOptions = defaultGetMonitoringEventsOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore/orders/${options.orderId}/monitoring-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              pageSize: options.events.length,
              events: options.events,
            }
          : null,
    },
  })

const defaultGetIncidentEventsOptions = {
  httpStatus: 200,
  orderId: '123456789',
  events: [] as unknown[],
} as GetIncidentEventsStubOptions

type GetIncidentEventsStubOptions = {
  httpStatus: number
  orderId?: string
  events?: unknown[]
}

const getIncidentEvents = (
  options: GetIncidentEventsStubOptions = defaultGetIncidentEventsOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore/orders/${options.orderId}/incident-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              pageSize: options.events.length,
              events: options.events,
            }
          : null,
    },
  })

const defaultGetContactEventsOptions = {
  httpStatus: 200,
  orderId: '123456789',
  events: [] as unknown[],
} as GetContactEventsStubOptions

type GetContactEventsStubOptions = {
  httpStatus: number
  orderId?: string
  events?: unknown[]
}

const getContactEvents = (options: GetContactEventsStubOptions = defaultGetContactEventsOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore/orders/${options.orderId}/contact-events`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              pageSize: options.events.length,
              events: options.events,
            }
          : null,
    },
  })

export default {
  stubDatastoreGetMonitoringEvents: getMonitoringEvents,
  stubDatastoreGetIncidentEvents: getIncidentEvents,
  stubDatastoreGetContactEvents: getContactEvents,
}
