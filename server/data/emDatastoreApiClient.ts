import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'
import { OrderRequest } from '../types/OrderRequest'

import { IntegrityOrderSummary } from '../interfaces/integrity/orderSummary'
import { IndegrityOrderDetails } from '../interfaces/integrity/orderDetails'
import { IntegrityEquipmentDetails } from '../models/integrity/equipmentDetails'
import { IntegrityVisitDetails } from '../models/integrity/visitDetails'
import { IntegrityServiceDetail } from '../models/integrity/serviceDetail'
import { IntegrityContactEvent } from '../models/integrity/contactEvents'
import { IntegrityIncidentEvent } from '../models/integrity/incidentEvents'
import { IntegrityMonitoringEvent } from '../models/integrity/monitoringEvents'
import { IntegrityViolationEvent } from '../models/integrity/violationEvents'
import { SuspensionOfVisitsEvent } from '../models/suspensionOfVisits'

import { AlcoholMonitoringOrderSummary } from '../models/alcoholMonitoring/orderSummary'
import { AlcoholMonitoringOrderDetails } from '../models/alcoholMonitoring/orderDetails'
import { AlcoholMonitoringEquipmentDetails } from '../models/alcoholMonitoring/equipmentDetails'
import { AlcoholMonitoringVisitDetails } from '../models/alcoholMonitoring/visitDetails'
import { AlcoholMonitoringServiceDetails } from '../models/alcoholMonitoring/serviceDetails'
import { AlcoholMonitoringContactEvent } from '../models/alcoholMonitoring/contactEvents'
import { AlcoholMonitoringIncidentEvent } from '../models/alcoholMonitoring/incidentEvents'
import { AlcoholMonitoringViolationEvent } from '../models/alcoholMonitoring/violationEvents'

export default class EmDatastoreApiClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('emDatastoreApiClient', config.apis.emDatastoreApi as ApiConfig, token)
  }

  updateToken(newTokenValue: string): void {
    this.restClient.updateToken(newTokenValue)
  }

  async submitSearchQuery(input: SearchFormInput): Promise<QueryExecutionResponse> {
    const { data } = input
    return this.restClient.post<QueryExecutionResponse>({
      path: '/orders',
      data,
    })
  }

  async getSearchResults(request: SearchResultsRequest): Promise<Order[]> {
    const { queryExecutionId } = request
    return this.restClient.get<Order[]>({
      path: `/orders?id=${queryExecutionId}`,
    })
  }

  async confirmApi(): Promise<JSON> {
    return this.restClient.get<JSON>({
      path: '/test',
    })
  }

  async getIntegritySummary(input: OrderRequest): Promise<IntegrityOrderSummary> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityOrderSummary>({
      path: `/orders/integrity/${legacySubjectId}`,
    })
  }

  async getAlcoholMonitoringSummary(input: OrderRequest): Promise<AlcoholMonitoringOrderSummary> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringOrderSummary>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/information`,
    })
  }

  async getIntegrityDetails(input: OrderRequest): Promise<IndegrityOrderDetails> {
    const { legacySubjectId } = input
    return this.restClient.get<IndegrityOrderDetails>({
      path: `/orders/integrity/${legacySubjectId}/details`,
    })
  }

  async getAlcoholMonitoringDetails(input: OrderRequest): Promise<AlcoholMonitoringOrderDetails> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringOrderDetails>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/details`,
    })
  }

  async getIntegrityMonitoringEvents(input: OrderRequest): Promise<IntegrityMonitoringEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityMonitoringEvent[]>({
      path: `/orders/integrity/${legacySubjectId}/monitoring-events`,
    })
  }

  async getIntegrityIncidentEvents(input: OrderRequest): Promise<IntegrityIncidentEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityIncidentEvent[]>({
      path: `/orders/integrity/${legacySubjectId}/incident-events`,
    })
  }

  async getAlcoholMonitoringIncidentEvents(input: OrderRequest): Promise<AlcoholMonitoringIncidentEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringIncidentEvent[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/incident-events`,
    })
  }

  async getIntegrityViolationEvents(input: OrderRequest): Promise<IntegrityViolationEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityViolationEvent[]>({
      path: `/orders/integrity/${legacySubjectId}/violation-events`,
    })
  }

  async getAlcoholMonitoringViolationEvents(input: OrderRequest): Promise<AlcoholMonitoringViolationEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringViolationEvent[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/violation-events`,
    })
  }

  async getIntegrityContactEvents(input: OrderRequest): Promise<IntegrityContactEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityContactEvent[]>({
      path: `/orders/integrity/${legacySubjectId}/contact-events`,
    })
  }

  async getAlcoholMonitoringContactEvents(input: OrderRequest): Promise<AlcoholMonitoringContactEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringContactEvent[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/contact-events`,
    })
  }

  async getIntegrityEquipmentDetails(input: OrderRequest): Promise<IntegrityEquipmentDetails[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityEquipmentDetails[]>({
      path: `/orders/integrity/${legacySubjectId}/equipment-details`,
    })
  }

  async getAlcoholMonitoringEquipmentDetails(input: OrderRequest): Promise<AlcoholMonitoringEquipmentDetails[]> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringEquipmentDetails[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`,
    })
  }

  async getIntegrityVisitDetails(input: OrderRequest): Promise<IntegrityVisitDetails[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityVisitDetails[]>({
      path: `/orders/integrity/${legacySubjectId}/visit-details`,
    })
  }

  async getAlcoholMonitoringVisitDetails(input: OrderRequest): Promise<AlcoholMonitoringVisitDetails[]> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringVisitDetails[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/visit-details`,
    })
  }

  async getSuspensionOfVisits(input: OrderRequest): Promise<SuspensionOfVisitsEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<SuspensionOfVisitsEvent[]>({
      path: `/orders/integrity/${legacySubjectId}/suspension-of-visits`,
    })
  }

  async getIntegrityServiceDetails(input: OrderRequest): Promise<IntegrityServiceDetail[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityServiceDetail[]>({
      path: `/orders/integrity/${legacySubjectId}/service-details`,
    })
  }

  async getAlcoholMonitoringServiceDetails(input: OrderRequest): Promise<AlcoholMonitoringServiceDetails[]> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringServiceDetails[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/services`,
    })
  }
}
