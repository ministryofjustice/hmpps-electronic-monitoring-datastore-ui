import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import {
  AlcoholMonitoringContactEvent,
  AlcoholMonitoringContactEventModel,
} from '../../models/alcoholMonitoring/contactEvents'
import {
  AlcoholMonitoringIncidentEvent,
  AlcoholMonitoringIncidentEventModel,
} from '../../models/alcoholMonitoring/incidentEvents'
import {
  AlcoholMonitoringViolationEvent,
  AlcoholMonitoringViolationEventModel,
} from '../../models/alcoholMonitoring/violationEvents'

export default class AlcoholMonitoringEventHistoryService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEventHistory(
    input: OrderRequest,
  ): Promise<(AlcoholMonitoringContactEvent | AlcoholMonitoringIncidentEvent | AlcoholMonitoringViolationEvent)[]> {
    return (
      await Promise.all([this.getContactEvents(input), this.getIncidentEvents(input), this.getViolationEvents(input)])
    ).flat()
  }

  private async getIncidentEvents(input: OrderRequest): Promise<AlcoholMonitoringIncidentEvent[]> {
    try {
      const result = await this.emDatastoreApiClient.get<AlcoholMonitoringIncidentEvent[]>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}/incident-events`,
        token: input.userToken,
      })

      return result.map(incidentEvent => AlcoholMonitoringIncidentEventModel.parse(incidentEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of incident events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  private async getContactEvents(input: OrderRequest): Promise<AlcoholMonitoringContactEvent[]> {
    try {
      const result = await this.emDatastoreApiClient.get<AlcoholMonitoringContactEvent[]>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}/contact-events`,
        token: input.userToken,
      })

      return result.map(contactEvent => AlcoholMonitoringContactEventModel.parse(contactEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of contact events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  private async getViolationEvents(input: OrderRequest): Promise<AlcoholMonitoringViolationEvent[]> {
    try {
      const result = await this.emDatastoreApiClient.get<AlcoholMonitoringViolationEvent[]>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}/violation-events`,
        token: input.userToken,
      })

      return result.map(violationEvent => AlcoholMonitoringViolationEventModel.parse(violationEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of violation events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
