import logger from '../../../logger'
import getSanitisedError from '../../sanitisedError'

import { EmDatastoreApiClient } from '../../data'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityContactEvent, IntegrityContactEventModel } from '../../models/integrity/contactEvents'
import { IntegrityIncidentEvent, IntegrityIncidentEventModel } from '../../models/integrity/incidentEvents'
import { IntegrityMonitoringEvent, IntegrityMonitoringEventModel } from '../../models/integrity/monitoringEvents'
import { IntegrityViolationEvent, IntegrityViolationEventModel } from '../../models/integrity/violationEvents'

export default class IntegrityEventHistoryService {
  constructor(private readonly emDatastoreApiClient: EmDatastoreApiClient) {}

  async getEventHistory(
    input: OrderRequest,
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

  private async getIncidentEvents(input: OrderRequest): Promise<IntegrityIncidentEvent[]> {
    try {
      const result = await this.emDatastoreApiClient.get<IntegrityIncidentEvent[]>({
        path: `/orders/integrity/${input.legacySubjectId}/incident-events`,
        token: input.userToken,
      })

      return result.map(incidentEvent => IntegrityIncidentEventModel.parse(incidentEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of incident events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  private async getContactEvents(input: OrderRequest): Promise<IntegrityContactEvent[]> {
    try {
      const result = await this.emDatastoreApiClient.get<IntegrityContactEvent[]>({
        path: `/orders/integrity/${input.legacySubjectId}/contact-events`,
        token: input.userToken,
      })

      return result.map(contactEvent => IntegrityContactEventModel.parse(contactEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of contact events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  private async getViolationEvents(input: OrderRequest): Promise<IntegrityViolationEvent[]> {
    try {
      const result = await this.emDatastoreApiClient.get<IntegrityViolationEvent[]>({
        path: `/orders/integrity/${input.legacySubjectId}/violation-events`,
        token: input.userToken,
      })

      return result.map(violationEvent => IntegrityViolationEventModel.parse(violationEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of violation events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }

  private async getMonitoringEvents(input: OrderRequest): Promise<IntegrityMonitoringEvent[]> {
    try {
      const result = await this.emDatastoreApiClient.get<IntegrityMonitoringEvent[]>({
        path: `/orders/integrity/${input.legacySubjectId}/monitoring-events`,
        token: input.userToken,
      })

      return result.map(monitoringEvent => IntegrityMonitoringEventModel.parse(monitoringEvent))
    } catch (error) {
      const userFreindlyMessage = 'Error retrieving list of monitoring events'
      const sanitisedError = getSanitisedError(error)
      logger.error(sanitisedError, userFreindlyMessage)
      sanitisedError.message = `${userFreindlyMessage}: ${sanitisedError.message}`
      throw sanitisedError
    }
  }
}
