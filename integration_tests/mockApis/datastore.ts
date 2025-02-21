import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import config from '../../server/config'
import orders from '../../server/data/mockData/orders'
import { Order } from '../../server/interfaces/order'

// GetSearchResults
const defaultGetSearchResultsOptions = {
  queryExecutionId: 'query-execution-id',
  httpStatus: 200,
  results: orders,
}

type GetSearchResultsStubOptions = {
  queryExecutionId: string
  httpStatus: number
  results: Order[]
}

const getSearchResults = (options: GetSearchResultsStubOptions = defaultGetSearchResultsOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.searchOrders}/${options.queryExecutionId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.results : null,
    },
  })

// GetOrderDetails
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

// GetOrderSummary

const defaultGetOrderSummaryOptions = {
  httpStatus: 200,
  orderId: '123456789',
  events: [] as unknown[],
  keyOrderInformation: {
    specials: 'no',
    legacySubjectId: '1234567',
    legacyOrderId: '123456789',
    name: 'Testopher Fakesmith',
    alias: 'an old tv show',
    dateOfBirth: '1950-01-01',
    postcode: '7AB 8CD',
    address1: '123 Fourth Street',
    address2: 'Fiveton',
    address3: 'Sixbury',
    orderStartDate: '2010-01-01',
    orderEndDate: '2030-01-01',
  },
  subjectHistoryReport: {
    reportUrl: '',
    name: '',
    createdOn: '',
    time: '',
  },
  documents: {
    pageSize: 1,
    orderDocuments: [],
  },
} as GetOrderSummaryStubOptions

type GetOrderSummaryStubOptions = {
  httpStatus: number
  orderId?: string
  events?: unknown[]
  keyOrderInformation?: object
  subjectHistoryReport?: object
  documents?: object
}

const getOrderSummary = (options: GetOrderSummaryStubOptions = defaultGetOrderSummaryOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.getOrderSummary}/${options.orderId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              keyOrderInformation: options.keyOrderInformation,
              subjectHistoryReport: options.subjectHistoryReport,
              documents: options.documents,
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

const defaultBasicStubOptions = {
  httpStatus: 200,
  orderId: '123456789',
  body: [] as unknown[],
}

type GetBasicStubOptions = {
  httpStatus: number
  orderId?: string
  body?: unknown[]
}

const getCurfewTimetable = (options: GetBasicStubOptions = defaultBasicStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.getCurfewTimetable}/${options.orderId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

const getEquipmentDetails = (options: GetBasicStubOptions = defaultBasicStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.getEquipmentDetails}/${options.orderId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

const getMonitoringEvents = (options: GetBasicStubOptions = defaultBasicStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.getMonitoringEvents}/${options.orderId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

const getContactEvents = (options: GetBasicStubOptions = defaultBasicStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.getContactEvents}/${options.orderId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

const getIncidentEvents = (options: GetBasicStubOptions = defaultBasicStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.getIncidentEvents}/${options.orderId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

const getViolationEvents = (options: GetBasicStubOptions = defaultBasicStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.getViolationEvents}/${options.orderId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

const getVisitDetails = (options: GetBasicStubOptions = defaultBasicStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/datastore${config.apiEndpoints.getVisitDetails}/${options.orderId}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: options.httpStatus === 200 ? options.body : null,
    },
  })

export default {
  stubDatastoreGetSearchResults: getSearchResults,
  stubDatastoreGetOrderDetails: getOrderDetails,
  stubDatastoreGetMonitoringEvents: getMonitoringEvents,
  stubDatastoreGetIncidentEvents: getIncidentEvents,
  stubDatastoreGetContactEvents: getContactEvents,
  stubDatastoreGetOrderSummary: getOrderSummary,
  stubDatastoreGetSuspensionOfVisits: getSuspensionOfVisits,
  stubDatastoreGetCurfewTimetable: getCurfewTimetable,
  stubDatastoreGetEquipmentDetails: getEquipmentDetails,
  stubDatastoreGetViolationEvents: getViolationEvents,
  stubDatastoreGetVisitDetails: getVisitDetails,
}
