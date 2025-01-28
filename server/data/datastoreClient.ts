import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import { SearchFormInput } from '../types/SearchFormInput'
import { OrderRequest } from '../types/OrderRequest'
import { OrderDetails } from '../interfaces/orderDetails'
import { OrderInformation } from '../interfaces/orderInformation'
import { ContactEventModel, ContactEvents, ContactEvent } from '../models/contactEvents'
import { IncidentEventModel, IncidentEvents, IncidentEvent } from '../models/incidentEvents'
import { MonitoringEventModel, MonitoringEvents, MonitoringEvent } from '../models/monitoringEvents'

export default class DatastoreClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'datastoreApiClient',
      config.apis.electronicMonitoringDatastore as ApiConfig,
      token,
    )
  }

  updateToken(newTokenValue: string): void {
    this.restClient.updateToken(newTokenValue)
  }

  // TODO: This should replace SearchForOrders
  async searchOrders(input: SearchFormInput): Promise<Order[]> {
    const { data } = input

    const results: Order[] = await this.restClient.post<Order[]>({
      path: config.apiEndpoints.searchOrders,
      data,
    })

    return results
  }

  async getCases(critera: Order): Promise<Order> {
    const result: Order = await this.restClient.get({
      path: `${config.apiEndpoints.getCases}/${critera.legacySubjectId}`,
    })

    return result
  }

  async confirmApi(): Promise<JSON> {
    const result: JSON = await this.restClient.get({
      path: config.apiEndpoints.confirmAPI,
    })

    return result
  }

  async getOrderSummary(input: OrderRequest): Promise<OrderInformation> {
    const { orderId } = input

    const result: OrderInformation = await this.restClient.get({
      path: `${config.apiEndpoints.getOrderSummary}/${orderId}`,
    })

    return result
  }

  async getOrderDetails(input: OrderRequest): Promise<OrderDetails> {
    const { orderId } = input

    const result: OrderDetails = await this.restClient.get({
      path: `${config.apiEndpoints.getOrderDetails}/${orderId}`,
    })

    return result
  }

  async getMonitoringEvents(input: OrderRequest): Promise<MonitoringEvent[]> {
    const { orderId } = input

    const result: MonitoringEvents = await this.restClient.get({
      path: `/orders/${orderId}/monitoring-events`,
    })

    const events = result.events.map(event => MonitoringEventModel.parse(event))

    return events
  }

  async getIncidentEvents(input: OrderRequest): Promise<IncidentEvent[]> {
    const { orderId } = input

    const result: IncidentEvents = await this.restClient.get({
      path: `/orders/${orderId}/incident-events`,
    })

    const events = result.events.map(event => IncidentEventModel.parse(event))

    return events
  }

  async getContactHistory(input: OrderRequest): Promise<ContactEvent[]> {
    const { orderId } = input

    const result: ContactEvents = await this.restClient.get({
      path: `/orders/${orderId}/contact-events`,
    })

    const events = result.events.map(event => ContactEventModel.parse(event))

    return events
  }
}
