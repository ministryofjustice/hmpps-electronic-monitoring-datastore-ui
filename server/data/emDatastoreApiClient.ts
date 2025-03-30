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
      path: `/integrity/orders?queryExecutionId=${queryExecutionId}`,
    })
  }

  async confirmApi(): Promise<JSON> {
    return this.restClient.get<JSON>({
      path: '/test',
    })
  }

  async getOrderSummary(input: OrderRequest): Promise<OrderInformation> {
    const { orderId } = input
    return this.restClient.get<OrderInformation>({
      path: `/integrity/orders/${orderId}`,
    })
  }

  async getOrderDetails(input: OrderRequest): Promise<OrderDetails> {
    const { orderId } = input
    return this.restClient.get<OrderDetails>({
      path: `/integrity/orders/${orderId}/details`,
    })
  }

  async getMonitoringEvents(input: OrderRequest): Promise<MonitoringEvent[]> {
    const { orderId } = input
    return this.restClient.get<MonitoringEvent[]>({
      path: `/integrity/orders/${orderId}/monitoring-events`,
    })
  }

  async getIncidentEvents(input: OrderRequest): Promise<IncidentEvent[]> {
    const { orderId } = input
    return this.restClient.get<IncidentEvent[]>({
      path: `/integrity/orders/${orderId}/incident-events`,
    })
  }

  async getViolationEvents(input: OrderRequest): Promise<ViolationEvent[]> {
    const { orderId } = input
    return this.restClient.get<ViolationEvent[]>({
      path: `/integrity/orders/${orderId}/violation-events`,
    })
  }

  async getContactEvents(input: OrderRequest): Promise<ContactEvent[]> {
    const { orderId } = input
    return this.restClient.get<ContactEvent[]>({
      path: `/integrity/orders/${orderId}/contact-events`,
    })
  }

  async getEquipmentDetails(input: OrderRequest): Promise<EquipmentDetails[]> {
    const { orderId } = input
    return this.restClient.get<EquipmentDetails[]>({
      path: `/integrity/orders/${orderId}/equipment-details`,
    })
  }

  async getVisitDetails(input: OrderRequest): Promise<VisitDetails[]> {
    const { orderId } = input
    return this.restClient.get<VisitDetails[]>({
      path: `/integrity/orders/${orderId}/visit-details`,
    })
  }

  async getSuspensionOfVisits(input: OrderRequest): Promise<SuspensionOfVisitsEvent[]> {
    const { orderId } = input
    return this.restClient.get<SuspensionOfVisitsEvent[]>({
      path: `/integrity/orders/${orderId}/suspension-of-visits`,
    })
  }

  async getCurfewTimetable(input: OrderRequest): Promise<CurfewTimetable[]> {
    const { orderId } = input
    return this.restClient.get<CurfewTimetable[]>({
      path: `/integrity/orders/${orderId}/curfew-timetable`,
    })
  }
}
