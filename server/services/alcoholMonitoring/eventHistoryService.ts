import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { AlcoholMonitoringContactEvent } from '../../data/models/alcoholMonitoringContactEvent'
import { AlcoholMonitoringIncidentEvent } from '../../data/models/alcoholMonitoringIncidentEvent'
import { AlcoholMonitoringViolationEvent } from '../../data/models/alcoholMonitoringViolationEvent'

export default class AlcoholMonitoringEventHistoryService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEventHistory(
    input: GetOrderRequest,
  ): Promise<(AlcoholMonitoringContactEvent | AlcoholMonitoringIncidentEvent | AlcoholMonitoringViolationEvent)[]> {
    return (
      await Promise.all([this.getContactEvents(input), this.getIncidentEvents(input), this.getViolationEvents(input)])
    ).flat()
  }

  private async getIncidentEvents(input: GetOrderRequest): Promise<AlcoholMonitoringIncidentEvent[]> {
    try {
      const result = await this.emDatastoreApiClient.get<AlcoholMonitoringIncidentEvent[]>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}/incident-events`,
        token: input.userToken,
      })

      return result.map(incidentEvent => AlcoholMonitoringIncidentEvent.parse(incidentEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of incident events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  private async getContactEvents(input: GetOrderRequest): Promise<AlcoholMonitoringContactEvent[]> {
    try {
      const result = await this.emDatastoreApiClient.get<AlcoholMonitoringContactEvent[]>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}/contact-events`,
        token: input.userToken,
      })

      return result.map(contactEvent => AlcoholMonitoringContactEvent.parse(contactEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of contact events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  private async getViolationEvents(input: GetOrderRequest): Promise<AlcoholMonitoringViolationEvent[]> {
    try {
      const result = await this.emDatastoreApiClient.get<AlcoholMonitoringViolationEvent[]>({
        path: `/orders/alcohol-monitoring/${input.legacySubjectId}/violation-events`,
        token: input.userToken,
      })

      return result.map(violationEvent => AlcoholMonitoringViolationEvent.parse(violationEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of violation events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
