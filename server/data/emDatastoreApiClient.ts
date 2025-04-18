import RestClient from './restClient'
import { ApiConfig } from '../config'
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
import { IntegritySuspensionOfVisitsEvent } from '../models/integrity/suspensionOfVisits'

import { AlcoholMonitoringOrderSummary } from '../models/alcoholMonitoring/orderSummary'
import { AlcoholMonitoringOrderDetails } from '../models/alcoholMonitoring/orderDetails'
import { AlcoholMonitoringEquipmentDetails } from '../models/alcoholMonitoring/equipmentDetails'
import { AlcoholMonitoringVisitDetails } from '../models/alcoholMonitoring/visitDetails'
import { AlcoholMonitoringServiceDetails } from '../models/alcoholMonitoring/serviceDetails'
import { AlcoholMonitoringContactEvent } from '../models/alcoholMonitoring/contactEvents'
import { AlcoholMonitoringIncidentEvent } from '../models/alcoholMonitoring/incidentEvents'
import { AlcoholMonitoringViolationEvent } from '../models/alcoholMonitoring/violationEvents'

export default class EmDatastoreApiClient extends RestClient {
  constructor(apiConfig: ApiConfig) {
    super('emDatastoreApiClient', apiConfig)
  }

  async submitSearchQuery(input: SearchFormInput, token: string): Promise<QueryExecutionResponse> {
    const { data } = input
    return this.post<QueryExecutionResponse>({
      path: '/orders',
      data,
      token,
    })
  }

  async getSearchResults(request: SearchResultsRequest, token: string): Promise<Order[]> {
    const { queryExecutionId } = request
    return this.get<Order[]>({
      path: `/orders?id=${queryExecutionId}`,
      token,
    })
  }

  async confirmApi(token: string): Promise<JSON> {
    return this.get<JSON>({
      path: '/test',
      token,
    })
  }

  async getIntegritySummary(input: OrderRequest, token: string): Promise<IntegrityOrderSummary> {
    const { legacySubjectId } = input
    return this.get<IntegrityOrderSummary>({
      path: `/orders/integrity/${legacySubjectId}`,
      token,
    })
  }

  async getAlcoholMonitoringSummary(input: OrderRequest, token: string): Promise<AlcoholMonitoringOrderSummary> {
    const { legacySubjectId } = input
    return this.get<AlcoholMonitoringOrderSummary>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/information`,
      token,
    })
  }

  async getIntegrityDetails(input: OrderRequest, token: string): Promise<IndegrityOrderDetails> {
    const { legacySubjectId } = input
    return this.get<IndegrityOrderDetails>({
      path: `/orders/integrity/${legacySubjectId}/details`,
      token,
    })
  }

  async getAlcoholMonitoringDetails(input: OrderRequest, token: string): Promise<AlcoholMonitoringOrderDetails> {
    const { legacySubjectId } = input
    return this.get<AlcoholMonitoringOrderDetails>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/details`,
      token,
    })
  }

  async getIntegrityMonitoringEvents(input: OrderRequest, token: string): Promise<IntegrityMonitoringEvent[]> {
    const { legacySubjectId } = input
    return this.get<IntegrityMonitoringEvent[]>({
      path: `/orders/integrity/${legacySubjectId}/monitoring-events`,
      token,
    })
  }

  async getIntegrityIncidentEvents(input: OrderRequest, token: string): Promise<IntegrityIncidentEvent[]> {
    const { legacySubjectId } = input
    return this.get<IntegrityIncidentEvent[]>({
      path: `/orders/integrity/${legacySubjectId}/incident-events`,
      token,
    })
  }

  async getAlcoholMonitoringIncidentEvents(
    input: OrderRequest,
    token: string,
  ): Promise<AlcoholMonitoringIncidentEvent[]> {
    const { legacySubjectId } = input
    return this.get<AlcoholMonitoringIncidentEvent[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/incident-events`,
      token,
    })
  }

  async getIntegrityViolationEvents(input: OrderRequest, token: string): Promise<IntegrityViolationEvent[]> {
    const { legacySubjectId } = input
    return this.get<IntegrityViolationEvent[]>({
      path: `/orders/integrity/${legacySubjectId}/violation-events`,
      token,
    })
  }

  async getAlcoholMonitoringViolationEvents(
    input: OrderRequest,
    token: string,
  ): Promise<AlcoholMonitoringViolationEvent[]> {
    const { legacySubjectId } = input
    return this.get<AlcoholMonitoringViolationEvent[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/violation-events`,
      token,
    })
  }

  async getIntegrityContactEvents(input: OrderRequest, token: string): Promise<IntegrityContactEvent[]> {
    const { legacySubjectId } = input
    return this.get<IntegrityContactEvent[]>({
      path: `/orders/integrity/${legacySubjectId}/contact-events`,
      token,
    })
  }

  async getAlcoholMonitoringContactEvents(
    input: OrderRequest,
    token: string,
  ): Promise<AlcoholMonitoringContactEvent[]> {
    const { legacySubjectId } = input
    return this.get<AlcoholMonitoringContactEvent[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/contact-events`,
      token,
    })
  }

  async getIntegrityEquipmentDetails(input: OrderRequest, token: string): Promise<IntegrityEquipmentDetails[]> {
    const { legacySubjectId } = input
    return this.get<IntegrityEquipmentDetails[]>({
      path: `/orders/integrity/${legacySubjectId}/equipment-details`,
      token,
    })
  }

  async getAlcoholMonitoringEquipmentDetails(
    input: OrderRequest,
    token: string,
  ): Promise<AlcoholMonitoringEquipmentDetails[]> {
    const { legacySubjectId } = input
    return this.get<AlcoholMonitoringEquipmentDetails[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`,
      token,
    })
  }

  async getIntegrityVisitDetails(input: OrderRequest, token: string): Promise<IntegrityVisitDetails[]> {
    const { legacySubjectId } = input
    return this.get<IntegrityVisitDetails[]>({
      path: `/orders/integrity/${legacySubjectId}/visit-details`,
      token,
    })
  }

  async getAlcoholMonitoringVisitDetails(input: OrderRequest, token: string): Promise<AlcoholMonitoringVisitDetails[]> {
    const { legacySubjectId } = input
    return this.get<AlcoholMonitoringVisitDetails[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/visit-details`,
      token,
    })
  }

  async getSuspensionOfVisits(input: OrderRequest, token: string): Promise<IntegritySuspensionOfVisitsEvent[]> {
    const { legacySubjectId } = input
    return this.get<IntegritySuspensionOfVisitsEvent[]>({
      path: `/orders/integrity/${legacySubjectId}/suspension-of-visits`,
      token,
    })
  }

  async getIntegrityServiceDetails(input: OrderRequest, token: string): Promise<IntegrityServiceDetail[]> {
    const { legacySubjectId } = input
    return this.get<IntegrityServiceDetail[]>({
      path: `/orders/integrity/${legacySubjectId}/service-details`,
      token,
    })
  }

  async getAlcoholMonitoringServiceDetails(
    input: OrderRequest,
    token: string,
  ): Promise<AlcoholMonitoringServiceDetails[]> {
    const { legacySubjectId } = input
    return this.get<AlcoholMonitoringServiceDetails[]>({
      path: `/orders/alcohol-monitoring/${legacySubjectId}/services`,
      token,
    })
  }
}
