import { RestClient, asUser } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import config from '../config'
import logger from '../../logger'

import { OrderSearchCriteria } from './models/orderSearchCriteria'

import { IntegrityOrderDetails } from './models/integrityOrderDetails'
import { IntegrityEquipmentDetails } from './models/integrityEquipmentDetails'
import { IntegrityIncidentEvent } from './models/integrityIncidentEvent'
import { IntegrityContactEvent } from './models/integrityContactEvent'
import { IntegrityViolationEvent } from './models/integrityViolationEvent'
import { IntegrityServiceDetails } from './models/integrityServiceDetails'
import { IntegrityVisitDetails } from './models/integrityVisitDetails'
import { IntegrityMonitoringEvent } from './models/integrityMonitoringEvent'
import { IntegritySuspensionOfVisits } from './models/integritySuspensionOfVisits'
import { QueryExecutionResponse } from '../models/queryExecutionResponse'

export default class IntegrityDatastoreClient extends RestClient {
  constructor(authenticationClient?: AuthenticationClient) {
    super('Integrity Datastore', config.apis.integrityDatastoreApi, logger, authenticationClient)
  }

  rootPath = '/orders/integrity'

  async runSearchQuery(
    searchType: string,
    data: OrderSearchCriteria,
    userToken: string,
    restricted: boolean = false,
  ): Promise<QueryExecutionResponse> {
    const result = await this.post<QueryExecutionResponse>(
      {
        path: `/orders/${searchType}`,
        query: { restricted },
        data,
      },
      asUser(userToken),
    )

    return QueryExecutionResponse.parse(result)
  }

  async listOrderDetailsByQueryExecutionId(queryExecutionId: string, userToken: string, restricted: boolean = false) {
    return this.get<IntegrityOrderDetails[]>(
      {
        path: this.rootPath,
        query: { restricted, id: queryExecutionId },
      },
      asUser(userToken),
    )
  }

  async getOrderDetails(legacySubjectId: string, userToken: string, restricted: boolean = false) {
    return this.get<IntegrityOrderDetails>(
      {
        path: `${this.rootPath}/${legacySubjectId}`,
        query: { restricted },
      },
      asUser(userToken),
    )
  }

  async getEquipmentDetails(legacySubjectId: string, userToken: string, restricted: boolean = false) {
    return this.get<IntegrityEquipmentDetails[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/equipment-details`,
        query: { restricted },
      },
      asUser(userToken),
    )
  }

  async getServiceDetails(legacySubjectId: string, userToken: string, restricted: boolean = false) {
    return this.get<IntegrityServiceDetails[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/service-details`,
        query: { restricted },
      },
      asUser(userToken),
    )
  }

  async getVisitDetails(legacySubjectId: string, userToken: string, restricted: boolean = false) {
    return this.get<IntegrityVisitDetails[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/visit-details`,
        query: { restricted },
      },
      asUser(userToken),
    )
  }

  async getIncidentEvents(legacySubjectId: string, userToken: string, restricted: boolean = false) {
    return this.get<IntegrityIncidentEvent[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/incident-events`,
        query: { restricted },
      },
      asUser(userToken),
    )
  }

  async getContactEvents(legacySubjectId: string, userToken: string, restricted: boolean = false) {
    return this.get<IntegrityContactEvent[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/contact-events`,
        query: { restricted },
      },
      asUser(userToken),
    )
  }

  async getViolationEvents(legacySubjectId: string, userToken: string, restricted: boolean = false) {
    return this.get<IntegrityViolationEvent[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/violation-events`,
        query: { restricted },
      },
      asUser(userToken),
    )
  }

  async getMonitoringEvents(legacySubjectId: string, userToken: string, restricted: boolean = false) {
    return this.get<IntegrityMonitoringEvent[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/monitoring-events`,
        query: { restricted },
      },
      asUser(userToken),
    )
  }

  async getSuspensionOfVisits(legacySubjectId: string, userToken: string, restricted: boolean = false) {
    return this.get<IntegritySuspensionOfVisits[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/suspension-of-visits`,
        query: { restricted },
      },
      asUser(userToken),
    )
  }

  async testConnection(userToken: string) {
    return this.get<JSON>({ path: '/test' }, asUser(userToken))
  }
}
