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
      path: config.apiEndpoints.searchOrders,
      data,
    })
  }

  async getSearchResults(request: SearchResultsRequest): Promise<Order[]> {
    const { queryExecutionId } = request
    return this.restClient.post<Order[]>({
      path: `${config.apiEndpoints.searchOrders}/${queryExecutionId}`,
    })
  }

  async confirmApi(): Promise<JSON> {
    return this.restClient.get<JSON>({
      path: config.apiEndpoints.confirmAPI,
    })
  }

  async getOrderSummary(input: OrderRequest): Promise<OrderInformation> {
    const { orderId } = input
    return this.restClient.get<OrderInformation>({
      path: `${config.apiEndpoints.getOrderSummary}/${orderId}`,
    })
  }

  async getOrderDetails(input: OrderRequest): Promise<OrderDetails> {
    const { orderId } = input
    return this.restClient.get<OrderDetails>({
      path: `${config.apiEndpoints.getOrderDetails}/${orderId}`,
    })
  }

  async getMonitoringEvents(input: OrderRequest): Promise<MonitoringEvent[]> {
    const { orderId } = input
    return this.restClient.get<MonitoringEvent[]>({
      path: `${config.apiEndpoints.getMonitoringEvents}/${orderId}`,
    })
  }

  async getIncidentEvents(input: OrderRequest): Promise<IncidentEvent[]> {
    const { orderId } = input
    return this.restClient.get<IncidentEvent[]>({
      path: `${config.apiEndpoints.getIncidentEvents}/${orderId}`,
    })
  }

  async getViolationEvents(input: OrderRequest): Promise<ViolationEvent[]> {
    const { orderId } = input
    return this.restClient.get<ViolationEvent[]>({
      path: `${config.apiEndpoints.getViolationEvents}/${orderId}`,
    })
  }

  async getContactEvents(input: OrderRequest): Promise<ContactEvent[]> {
    const { orderId } = input
    return this.restClient.get<ContactEvent[]>({
      path: `${config.apiEndpoints.getContactEvents}/${orderId}`,
    })
  }

  async getEquipmentDetails(input: OrderRequest): Promise<EquipmentDetails[]> {
    const { orderId } = input
    return this.restClient.get<EquipmentDetails[]>({
      path: `${config.apiEndpoints.getEquipmentDetails}/${orderId}`,
    })
  }

  async getVisitDetails(input: OrderRequest): Promise<VisitDetails[]> {
    const { orderId } = input
    return this.restClient.get<VisitDetails[]>({
      path: `${config.apiEndpoints.getVisitDetails}/${orderId}`,
    })
  }

  async getSuspensionOfVisits(input: OrderRequest): Promise<SuspensionOfVisitsEvent[]> {
    const { orderId } = input
    return this.restClient.get<SuspensionOfVisitsEvent[]>({
      path: `${config.apiEndpoints.getSuspensionOfVisits}/${orderId}`,
    })
  }

  async getCurfewTimetable(input: OrderRequest): Promise<CurfewTimetable[]> {
    const { orderId } = input
    return this.restClient.get<CurfewTimetable[]>({
      path: `${config.apiEndpoints.getCurfewTimetable}/${orderId}`,
    })
  }
}
