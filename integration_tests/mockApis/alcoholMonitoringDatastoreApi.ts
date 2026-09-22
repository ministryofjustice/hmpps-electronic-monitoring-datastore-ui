import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

import { AlcoholMonitoringOrderDetails } from '../../server/data/models/alcoholMonitoringOrderDetails'
import { AlcoholMonitoringEquipmentDetails } from '../../server/data/models/alcoholMonitoringEquipmentDetails'
import { AlcoholMonitoringServiceDetails } from '../../server/data/models/alcoholMonitoringServiceDetails'
import { AlcoholMonitoringVisitDetails } from '../../server/data/models/alcoholMonitoringVisitDetails'
import { AlcoholMonitoringContactEvent } from '../../server/data/models/alcoholMonitoringContactEvent'
import { AlcoholMonitoringIncidentEvent } from '../../server/data/models/alcoholMonitoringIncidentEvent'
import { AlcoholMonitoringViolationEvent } from '../../server/data/models/alcoholMonitoringViolationEvent'

const defaultOrderDetails = (legacySubjectId: string) =>
  ({
    specials: 'no',
    legacySubjectId,
    firstName: 'John',
    lastName: 'Smith',
    alias: 'Zeno',
    dateOfBirth: '1980-02-01T00:00:00',
    sex: 'Sex',
    specialInstructions: 'Special instructions',
    phoneNumber: '09876543210',
    address1: '1 Primary Street',
    address2: 'Sutton',
    address3: 'London',
    postCode: 'ABC 123',
    orderStartDate: '2012-02-01T00:00:00',
    orderEndDate: '2013-04-03T00:00:00',
    enforceableCondition: 'Enforceable condition',
    orderType: 'Community',
    orderTypeDescription: '',
    orderEndOutcome: '',
    responsibleOrganisationPhoneNumber: '01234567890',
    responsibleOrganisationEmail: 'a@b.c',
    tagAtSource: '',
  }) as AlcoholMonitoringOrderDetails

const apiGetStubFor = (
  httpStatus: number,
  urlPath: string,
  queryParameters: Record<string, { equalTo: string } | { matches: string }> | undefined,
  body: unknown,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPath,
      queryParameters,
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: httpStatus === 200 ? body : undefined,
    },
  })

export default {
  stubPostOrderSearch: (queryExecutionId: string, httpStatus: number = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: `/datastore/orders/alcohol-monitoring`,
        queryParameters: { restricted: { equalTo: `false` } },
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: httpStatus === 200 ? { queryExecutionId } : undefined,
      },
    }),

  stubGetSearchResults: (
    queryExecutionId: string,
    legacySubjectId: string = 'default_legacy_subject_001',
    body: AlcoholMonitoringOrderDetails[] | undefined = undefined,
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/alcohol-monitoring`,
      { id: { equalTo: `${queryExecutionId}` } },
      body || [defaultOrderDetails(legacySubjectId)],
    ),

  stubGetOrderDetails: (
    legacySubjectId: string,
    body: AlcoholMonitoringOrderDetails | undefined = undefined,
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/alcohol-monitoring/${legacySubjectId}`,
      { restricted: { equalTo: `false` } },
      body || defaultOrderDetails(legacySubjectId),
    ),

  stubGetEquipmentDetails: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: AlcoholMonitoringEquipmentDetails[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`,
      { restricted: { equalTo: `false` } },
      body,
    ),

  stubGetServiceDetails: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: AlcoholMonitoringServiceDetails[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/alcohol-monitoring/${legacySubjectId}/service-details`,
      { restricted: { equalTo: `false` } },
      body,
    ),

  stubGetVisitDetails: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: AlcoholMonitoringVisitDetails[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/alcohol-monitoring/${legacySubjectId}/visit-details`,
      { restricted: { equalTo: `false` } },
      body,
    ),

  stubGetContactEvents: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: AlcoholMonitoringContactEvent[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/alcohol-monitoring/${legacySubjectId}/contact-events`,
      { restricted: { equalTo: `false` } },
      body,
    ),

  stubGetIncidentEvents: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: AlcoholMonitoringIncidentEvent[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/alcohol-monitoring/${legacySubjectId}/incident-events`,
      { restricted: { equalTo: `false` } },
      body,
    ),

  stubGetViolationEvents: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: AlcoholMonitoringViolationEvent[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/alcohol-monitoring/${legacySubjectId}/violation-events`,
      { restricted: { equalTo: `false` } },
      body,
    ),
}
