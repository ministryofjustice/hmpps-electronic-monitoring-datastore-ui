import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { GetOrderRequest } from '../../models/requests/GetOrderRequest'
import { IntegrityContactEvent } from '../../data/models/integrityContactEvent'
import { IntegrityIncidentEvent } from '../../data/models/integrityIncidentEvent'
import { IntegrityMonitoringEvent } from '../../data/models/integrityMonitoringEvent'
import { IntegrityViolationEvent } from '../../data/models/integrityViolationEvent'

export default class IntegrityEventHistoryService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEventHistory(
    input: GetOrderRequest,
  ): Promise<(IntegrityContactEvent | IntegrityIncidentEvent | IntegrityMonitoringEvent | IntegrityViolationEvent)[]> {
    return (
      await Promise.all([
        this.getMonitoringEvents(input),
        this.getIncidentEvents(input),
        this.getContactEvents(input),
        this.getViolationEvents(input),
      ])
    ).flat()
  }

  private async getIncidentEvents(input: GetOrderRequest): Promise<IntegrityIncidentEvent[]> {
    const { restricted } = input

    try {
      const result = await this.emDatastoreApiClient.get<IntegrityIncidentEvent[]>({
        path: `/orders/integrity/${input.legacySubjectId}/incident-events`,
        query: { restricted },
        token: input.userToken,
      })

      return result.map(incidentEvent => IntegrityIncidentEvent.parse(incidentEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of incident events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  private async getContactEvents(input: GetOrderRequest): Promise<IntegrityContactEvent[]> {
    const { restricted } = input

    try {
      const result = await this.emDatastoreApiClient.get<IntegrityContactEvent[]>({
        path: `/orders/integrity/${input.legacySubjectId}/contact-events`,
        query: { restricted },
        token: input.userToken,
      })

      return result.map(contactEvent => IntegrityContactEvent.parse(contactEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of contact events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  private async getViolationEvents(input: GetOrderRequest): Promise<IntegrityViolationEvent[]> {
    const { restricted } = input

    try {
      const result = await this.emDatastoreApiClient.get<IntegrityViolationEvent[]>({
        path: `/orders/integrity/${input.legacySubjectId}/violation-events`,
        query: { restricted },
        token: input.userToken,
      })

      return result.map(violationEvent => IntegrityViolationEvent.parse(violationEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of violation events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  private async getMonitoringEvents(input: GetOrderRequest): Promise<IntegrityMonitoringEvent[]> {
    const { restricted } = input

    try {
      const result = await this.emDatastoreApiClient.get<IntegrityMonitoringEvent[]>({
        path: `/orders/integrity/${input.legacySubjectId}/monitoring-events`,
        query: { restricted },
        token: input.userToken,
      })

      return result.map(monitoringEvent => IntegrityMonitoringEvent.parse(monitoringEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of monitoring events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
