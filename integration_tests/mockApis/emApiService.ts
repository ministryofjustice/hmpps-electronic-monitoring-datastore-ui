// import { stubFor, getMatchingRequests } from './wiremock'

import { SuperAgentRequest } from "superagent";
import { stubFor } from "./wiremock";

import { v4 as uuidv4 } from 'uuid'

// add a bunch of methods here as conts

const ping = (httpStatus = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/emApi/health',
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
    },
  })

type GetOrderStubOptions = {
    httpStatus: number
    id?: string
    status?: string
    // order?: Partial<Order>
  }

  const defaultGetOrderOptions = {
    httpStatus: 200,
    id: uuidv4(),
    status: 'IN_PROGRESS',
  }

const getOrder = (options: GetOrderStubOptions = defaultGetOrderOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/cemo/api/orders/${options.id}`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? {
              ...mockApiOrder(),
              id: options.id,
              status: options.status,
              // ...(options.order ? options.order : {}),
            }
          : null,
    },
  })

  export const mockApiOrder = (status: string = 'IN_PROGRESS') => ({
    id: uuidv4(),
    status,
    deviceWearer: {
      nomisId: null,
      pncId: null,
      deliusId: null,
      prisonNumber: null,
      homeOfficeReferenceNumber: null,
      firstName: null,
      lastName: null,
      alias: null,
      dateOfBirth: null,
      adultAtTimeOfInstallation: null,
      sex: null,
      gender: null,
      disabilities: null,
      noFixedAbode: null,
    },
    deviceWearerResponsibleAdult: null,
    enforcementZoneConditions: [],
    addresses: [],
    deviceWearerContactDetails: {
      contactNumber: null,
    },
    installationAndRisk: null,
    additionalDocuments: [],
    monitoringConditions: {
      orderType: null,
      acquisitiveCrime: null,
      dapol: null,
      curfew: null,
      exclusionZone: null,
      trail: null,
      mandatoryAttendance: null,
      alcohol: null,
      devicesRequired: null,
      orderTypeDescription: null,
      conditionType: null,
      startDate: null,
      endDate: null,
    },
    monitoringConditionsTrail: null,
    monitoringConditionsAlcohol: null,
  })