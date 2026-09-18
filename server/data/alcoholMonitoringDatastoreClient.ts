import { RestClient, asUser } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import getSanitisedError from '../sanitisedError'
import config from '../config'
import logger from '../../logger'

import { AlcoholMonitoringOrderDetails } from './models/alcoholMonitoringOrderDetails'
import { AlcoholMonitoringEquipmentDetails } from './models/alcoholMonitoringEquipmentDetails'
import { AlcoholMonitoringIncidentEvent } from './models/alcoholMonitoringIncidentEvent'
import { AlcoholMonitoringContactEvent } from './models/alcoholMonitoringContactEvent'
import { AlcoholMonitoringViolationEvent } from './models/alcoholMonitoringViolationEvent'
import { AlcoholMonitoringServiceDetails } from './models/alcoholMonitoringServiceDetails'
import { AlcoholMonitoringVisitDetails } from './models/alcoholMonitoringVisitDetails'

export default class AlcoholMonitoringDatastoreClient extends RestClient {
  constructor(authenticationClient?: AuthenticationClient) {
    super('Alcohol Monitoring Datastore', config.apis.alcoholMonitoringDatastoreApi, logger, authenticationClient)
  }

  rootPath = '/orders/alcohol-monitoring'

  listOrderDetailsByQueryExecutionId(queryExecutionId: string, userToken: string) {
    try {
      return this.get<AlcoholMonitoringOrderDetails[]>(
        {
          path: this.rootPath,
          query: { id: queryExecutionId },
        },
        asUser(userToken),
      )
    } catch (error) {
      let userFriendlyMessage = 'Error retrieving search results'
      const sanitisedError = getSanitisedError(error)

      const errorMessage: string | undefined = error.data?.developerMessage
      if (
        errorMessage &&
        errorMessage.includes('QueryExecution') &&
        errorMessage.includes('was not found (Service: Athena, Status Code: 400, Request ID:')
      ) {
        userFriendlyMessage += ': Invalid query execution ID'
      }

      sanitisedError.message = `${userFriendlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  async getOrderDetails(legacySubjectId: string, userToken: string) {
    return this.get<AlcoholMonitoringOrderDetails>(
      {
        path: `${this.rootPath}/${legacySubjectId}`,
      },
      asUser(userToken),
    )
  }

  async getEquipmentDetails(legacySubjectId: string, userToken: string) {
    return this.get<AlcoholMonitoringEquipmentDetails[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/equipment-details`,
      },
      asUser(userToken),
    )
  }

  getServiceDetails(legacySubjectId: string, userToken: string) {
    return this.get<AlcoholMonitoringServiceDetails[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/service-details`,
      },
      asUser(userToken),
    )
  }

  async getVisitDetails(legacySubjectId: string, userToken: string) {
    return this.get<AlcoholMonitoringVisitDetails[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/visit-details`,
      },
      asUser(userToken),
    )
  }

  async getIncidentEvents(legacySubjectId: string, userToken: string) {
    return this.get<AlcoholMonitoringIncidentEvent[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/incident-events`,
      },
      asUser(userToken),
    )
  }

  async getContactEvents(legacySubjectId: string, userToken: string) {
    return this.get<AlcoholMonitoringContactEvent[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/contact-events`,
      },
      asUser(userToken),
    )
  }

  async getViolationEvents(legacySubjectId: string, userToken: string) {
    return this.get<AlcoholMonitoringViolationEvent[]>(
      {
        path: `${this.rootPath}/${legacySubjectId}/violation-events`,
      },
      asUser(userToken),
    )
  }
}
