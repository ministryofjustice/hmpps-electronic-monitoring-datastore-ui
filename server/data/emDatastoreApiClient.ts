import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'
import { OrderRequest } from '../types/OrderRequest'
import { IntegrityOrderSummary } from '../interfaces/integrity/orderSummary'
import { AlcoholMonitoringOrderSummary } from '../models/alcoholMonitoring/orderSummary'
import { IndegrityOrderDetails } from '../interfaces/integrity/orderDetails'
import { AlcoholMonitoringOrderDetails } from '../models/alcoholMonitoring/orderDetails'
import { ContactEvent } from '../models/contactEvents'
import { IncidentEvent } from '../models/incidentEvents'
import { MonitoringEvent } from '../models/monitoringEvents'
import { ViolationEvent } from '../models/violationEvents'
import { IntegrityEquipmentDetails } from '../models/integrity/equipmentDetails'
import { AlcoholMonitoringEquipmentDetail } from '../models/alcoholMonitoring/equipmentDetails'
import { IntegrityVisitDetails } from '../models/integrity/visitDetails'
import { AlcoholMonitoringVisitDetails } from '../models/alcoholMonitoring/visitDetails'
import { IntegrityServiceDetail } from '../models/integrity/serviceDetail'
import { AlcoholMonitoringServiceDetail } from '../models/alcoholMonitoring/serviceDetail'
import { SuspensionOfVisitsEvent } from '../models/suspensionOfVisits'

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
      path: '/integrity/orders',
      data,
    })
  }

  async getSearchResults(request: SearchResultsRequest): Promise<Order[]> {
    const { queryExecutionId } = request
    return this.restClient.get<Order[]>({
      path: `/integrity/orders?id=${queryExecutionId}`,
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
      path: `/integrity/orders/${legacySubjectId}`,
    })
  }

  async getAlcoholMonitoringSummary(input: OrderRequest): Promise<AlcoholMonitoringOrderSummary> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringOrderSummary>({
      path: `/alcohol-monitoring/${legacySubjectId}/information`,
    })
  }

  async getIntegrityDetails(input: OrderRequest): Promise<IndegrityOrderDetails> {
    const { legacySubjectId } = input
    return this.restClient.get<IndegrityOrderDetails>({
      path: `/integrity/orders/${legacySubjectId}/details`,
    })
  }

  async getAlcoholMonitoringDetails(input: OrderRequest): Promise<AlcoholMonitoringOrderDetails> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringOrderDetails>({
      path: `/alcohol-monitoring/${legacySubjectId}/details`,
    })
  }

  async getMonitoringEvents(input: OrderRequest): Promise<MonitoringEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<MonitoringEvent[]>({
      path: `/integrity/orders/${legacySubjectId}/monitoring-events`,
    })
  }

  async getIncidentEvents(input: OrderRequest): Promise<IncidentEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IncidentEvent[]>({
      path: `/integrity/orders/${legacySubjectId}/incident-events`,
    })
  }

  async getViolationEvents(input: OrderRequest): Promise<ViolationEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<ViolationEvent[]>({
      path: `/integrity/orders/${legacySubjectId}/violation-events`,
    })
  }

  async getContactEvents(input: OrderRequest): Promise<ContactEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<ContactEvent[]>({
      path: `/integrity/orders/${legacySubjectId}/contact-events`,
    })
  }

  async getIntegrityEquipmentDetails(input: OrderRequest): Promise<IntegrityEquipmentDetails[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityEquipmentDetails[]>({
      path: `/integrity/orders/${legacySubjectId}/equipment-details`,
    })
  }

  async getAlcoholMonitoringEquipmentDetails(input: OrderRequest): Promise<AlcoholMonitoringEquipmentDetail[]> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringEquipmentDetail[]>({
      path: `/alcohol-monitoring/${legacySubjectId}/equipment-details`,
    })
  }

  async getIntegrityVisitDetails(input: OrderRequest): Promise<IntegrityVisitDetails[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityVisitDetails[]>({
      path: `/integrity/orders/${legacySubjectId}/visit-details`,
    })
  }

  async getAlcoholMonitoringVisitDetails(input: OrderRequest): Promise<AlcoholMonitoringVisitDetails[]> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringVisitDetails[]>({
      path: `/alcohol-monitoring/${legacySubjectId}/visit-details`,
    })
  }

  async getSuspensionOfVisits(input: OrderRequest): Promise<SuspensionOfVisitsEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<SuspensionOfVisitsEvent[]>({
      path: `/integrity/orders/${legacySubjectId}/suspension-of-visits`,
    })
  }

  async getIntegrityServiceDetails(input: OrderRequest): Promise<IntegrityServiceDetail[]> {
    const { legacySubjectId } = input
    return this.restClient.get<IntegrityServiceDetail[]>({
      path: `/integrity/orders/${legacySubjectId}/curfew-timetable`,
    })
  }

  async getAlcoholMonitoringServiceDetails(input: OrderRequest): Promise<AlcoholMonitoringServiceDetail[]> {
    const { legacySubjectId } = input
    return this.restClient.get<AlcoholMonitoringServiceDetail[]>({
      path: `/alcohol-monitoring/orders/${legacySubjectId}/service-details`,
    })
  }
}
