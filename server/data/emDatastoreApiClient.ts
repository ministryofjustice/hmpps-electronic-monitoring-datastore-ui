import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'
import { OrderRequest } from '../types/OrderRequest'
import { OrderDetails } from '../interfaces/orderDetails'
import { OrderInformation } from '../interfaces/orderInformation'
import { ContactEvent } from '../models/contactEvents'
import { IncidentEvent } from '../models/incidentEvents'
import { MonitoringEvent } from '../models/monitoringEvents'
import { ViolationEvent } from '../models/violationEvents'
import { EquipmentDetails } from '../models/equipmentDetails'
import { VisitDetails } from '../models/visitDetails'
import { CurfewTimetable } from '../models/curfewTimetable'
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

  async getOrderSummary(input: OrderRequest): Promise<OrderInformation> {
    const { legacySubjectId } = input
    return this.restClient.get<OrderInformation>({
      path: `/integrity/orders/${legacySubjectId}`,
    })
  }

  async getAlcoholMonitoringSummary(input: OrderRequest): Promise<OrderInformation> {
    const { legacySubjectId } = input
    return this.restClient.get<OrderInformation>({
      path: `/alcohol-monitoring/orders/${legacySubjectId}`,
    })
  }

  async getOrderDetails(input: OrderRequest): Promise<OrderDetails> {
    const { legacySubjectId } = input
    return this.restClient.get<OrderDetails>({
      path: `/integrity/orders/${legacySubjectId}/details`,
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

  async getEquipmentDetails(input: OrderRequest): Promise<EquipmentDetails[]> {
    const { legacySubjectId } = input
    return this.restClient.get<EquipmentDetails[]>({
      path: `/integrity/orders/${legacySubjectId}/equipment-details`,
    })
  }

  async getVisitDetails(input: OrderRequest): Promise<VisitDetails[]> {
    const { legacySubjectId } = input
    return this.restClient.get<VisitDetails[]>({
      path: `/integrity/orders/${legacySubjectId}/visit-details`,
    })
  }

  async getSuspensionOfVisits(input: OrderRequest): Promise<SuspensionOfVisitsEvent[]> {
    const { legacySubjectId } = input
    return this.restClient.get<SuspensionOfVisitsEvent[]>({
      path: `/integrity/orders/${legacySubjectId}/suspension-of-visits`,
    })
  }

  async getCurfewTimetable(input: OrderRequest): Promise<CurfewTimetable[]> {
    const { legacySubjectId } = input
    return this.restClient.get<CurfewTimetable[]>({
      path: `/integrity/orders/${legacySubjectId}/curfew-timetable`,
    })
  }
}
