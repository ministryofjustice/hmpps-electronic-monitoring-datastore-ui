import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import config from '../../server/config'

const defaultGetOrderDetailsOptions = {
  httpStatus: 200,
  orderId: '1234567',
  details: {
    specials: 'no',
    legacySubjectId: '1234567',
    legacyOrderId: '1234567',
    firstName: null,
    lastName: null,
    alias: null,
    dateOfBirth: null,
    adultOrChild: null,
    sex: null,
    contact: null,
    primaryAddressLine1: null,
    primaryAddressLine2: null,
    primaryAddressLine3: null,
    primaryAddressPostCode: null,
    phoneOrMobileNumber: null,
    ppo: null,
    mappa: null,
    technicalBail: null,
    manualRisk: null,
    offenceRisk: false,
    postCodeRisk: null,
    falseLimbRisk: null,
    migratedRisk: null,
    rangeRisk: null,
    reportRisk: null,
    orderStartDate: null,
    orderEndDate: null,
    orderType: null,
    orderTypeDescription: null,
    orderTypeDetail: null,
    wearingWristPid: null,
    notifyingOrganisationDetailsName: null,
    responsibleOrganisation: null,
    responsibleOrganisationDetailsRegion: null,
  },
} as GetOrderDetailsStubOptions

type GetOrderDetailsStubOptions = {
  httpStatus: number
  orderId?: string
  details: { [key: string]: string | boolean | null }
}

const getOrderDetails = (options: GetOrderDetailsStubOptions = defaultGetOrderDetailsOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.getOrderDetails}/${options.orderId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.details : null,
    },
  })

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
  stubDatastoreGetOrderDetails: getOrderDetails,
  stubDatastoreGetMonitoringEvents: getMonitoringEvents,
  stubDatastoreGetIncidentEvents: getIncidentEvents,
  stubDatastoreGetContactEvents: getContactEvents,
}
