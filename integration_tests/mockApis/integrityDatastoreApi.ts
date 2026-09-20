import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

import { IntegrityContactEvent } from '../../server/data/models/integrityContactEvent'
import { IntegrityEquipmentDetails } from '../../server/data/models/integrityEquipmentDetails'
import { IntegrityIncidentEvent } from '../../server/data/models/integrityIncidentEvent'
import { IntegrityMonitoringEvent } from '../../server/data/models/integrityMonitoringEvent'
import { IntegrityViolationEvent } from '../../server/data/models/integrityViolationEvent'
import { IntegrityOrderDetails } from '../../server/data/models/integrityOrderDetails'
import { IntegrityServiceDetails } from '../../server/data/models/integrityServiceDetails'
import { IntegrityVisitDetails } from '../../server/data/models/integrityVisitDetails'
import { IntegritySuspensionOfVisits } from '../../server/data/models/integritySuspensionOfVisits'

const defaultOrderDetails = (legacySubjectId: string, restricted: boolean) =>
  ({
    specials: restricted ? 'yes' : 'no',
    legacySubjectId,
    offenceRisk: false,
  }) as IntegrityOrderDetails

const apiGetStubFor = (
  httpStatus: number,
  url: string,
  queryParameters: Record<string, { equalTo: string } | { matches: string }> | undefined,
  body: unknown,
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url,
      queryParameters,
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: httpStatus === 200 ? body : undefined,
    },
  })

export default {
  stubGetSearchResults: (
    queryExecutionId: string,
    legacySubjectId: string = 'default_legacy_subject_001',
    restricted: boolean = false,
    body: IntegrityOrderDetails[] | undefined = undefined,
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/integrity/${legacySubjectId}`,
      { restricted: { equalTo: `${restricted}` }, id: { equalTo: `${queryExecutionId}` } },
      body || [defaultOrderDetails(legacySubjectId, restricted)],
    ),

  stubGetOrderDetails: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: IntegrityOrderDetails | undefined = undefined,
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/integrity/${legacySubjectId}`,
      { restricted: { equalTo: `${restricted}` } },
      body || defaultOrderDetails(legacySubjectId, restricted),
    ),

  stubGetEquipmentDetails: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: IntegrityEquipmentDetails[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/integrity/${legacySubjectId}/equipment-details`,
      { restricted: { equalTo: `${restricted}` } },
      body,
    ),

  stubGetServiceDetails: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: IntegrityServiceDetails[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/integrity/${legacySubjectId}/service-details`,
      { restricted: { equalTo: `${restricted}` } },
      body,
    ),

  stubGetVisitDetails: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: IntegrityVisitDetails[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/integrity/${legacySubjectId}/visit-details`,
      { restricted: { equalTo: `${restricted}` } },
      body,
    ),

  stubGetSuspensionOfVisits: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: IntegritySuspensionOfVisits[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/integrity/${legacySubjectId}/suspension-of-visits`,
      { restricted: { equalTo: `${restricted}` } },
      body,
    ),

  stubGetContactEvents: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: IntegrityContactEvent[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/integrity/${legacySubjectId}/contact-events`,
      { restricted: { equalTo: `${restricted}` } },
      body,
    ),

  stubGetIncidentEvents: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: IntegrityIncidentEvent[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/integrity/${legacySubjectId}/incident-events`,
      { restricted: { equalTo: `${restricted}` } },
      body,
    ),

  stubGetMonitoringEvents: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: IntegrityMonitoringEvent[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/integrity/${legacySubjectId}/monitoring-events`,
      { restricted: { equalTo: `${restricted}` } },
      body,
    ),

  stubGetViolationEvents: (
    legacySubjectId: string,
    restricted: boolean = false,
    body: IntegrityViolationEvent[] = [],
    httpStatus: number = 200,
  ): SuperAgentRequest =>
    apiGetStubFor(
      httpStatus,
      `/datastore/orders/integrity/${legacySubjectId}/violation-events`,
      { restricted: { equalTo: `${restricted}` } },
      body,
    ),
}
