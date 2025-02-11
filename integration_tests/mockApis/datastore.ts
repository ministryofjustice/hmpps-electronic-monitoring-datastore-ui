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

const defaultGetSuspensionOfVisitsOptions = {
  httpStatus: 200,
  orderId: 123456789,
  events: [
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      suspensionOfVisitsRequestedDate: '2001-01-01T01:01:01',
      suspensionOfVisitsStartDate: '2001-01-01T01:01:01',
      suspensionOfVisitsStartTime: '01:01:01',
      suspensionOfVisitsEndDate: '2001-01-01T01:01:01',
    },
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      suspensionOfVisitsRequestedDate: '2002-02-02T02:02:02',
      suspensionOfVisitsStartDate: '2002-02-02T02:02:02',
      suspensionOfVisitsStartTime: '02:02:02',
      suspensionOfVisitsEndDate: '2002-02-02T02:02:02',
    },
    {
      legacySubjectId: 123456789,
      suspensionOfVisits: 'Yes',
      suspensionOfVisitsRequestedDate: '2003-03-03T03:03:03',
      suspensionOfVisitsStartDate: '2003-03-03T03:03:03',
      suspensionOfVisitsStartTime: '03:03:03',
      suspensionOfVisitsEndDate: '2003-03-03T03:03:03',
    },
  ],
} as GetSuspensionOfVisitsStubOptions

type GetSuspensionOfVisitsStubOptions = {
  httpStatus: number
  orderId?: number
  events: { [key: string]: string | number | null }[]
}

const getSuspensionOfVisits = (
  options: GetSuspensionOfVisitsStubOptions = defaultGetSuspensionOfVisitsOptions,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.getSuspensionOfVisits}/${options.orderId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.events : null,
    },
  })

export default {
  stubDatastoreGetOrderDetails: getOrderDetails,
  stubDatastoreGetMonitoringEvents: getMonitoringEvents,
  stubDatastoreGetIncidentEvents: getIncidentEvents,
  stubDatastoreGetContactEvents: getContactEvents,
  stubDatastoreGetSuspensionOfVisits: getSuspensionOfVisits,
}
