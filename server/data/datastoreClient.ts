import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Orders } from '../interfaces/order'
import { SearchFormInput } from '../types/SearchFormInput'
import { OrderRequest } from '../types/OrderRequest'
import { OrderDetails } from '../interfaces/orderDetails'
import { OrderInformation } from '../interfaces/orderInformation'
import { ContactEventModel, ContactEvents, ContactEvent } from '../models/contactEvents'
import { IncidentEventModel, IncidentEvents, IncidentEvent } from '../models/incidentEvents'
import { MonitoringEventModel, MonitoringEvents, MonitoringEvent } from '../models/monitoringEvents'
import { SuspensionOfVisitsEventModel, SuspensionOfVisitsEvent } from '../models/suspensionOfVisits'

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

  async searchOrders(input: SearchFormInput): Promise<Orders> {
    const { data } = input

    const results: Orders = await this.restClient.post<Orders>({
      path: config.apiEndpoints.searchOrders,
      data,
    })

    return results
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
      path: config.apiEndpoints.getMonitoringEvents.replace('_ID_', orderId),
    })

    const events = result.events.map(event => MonitoringEventModel.parse(event))

    return events
  }

  async getIncidentEvents(input: OrderRequest): Promise<IncidentEvent[]> {
    const { orderId } = input

    const result: IncidentEvents = await this.restClient.get({
      path: config.apiEndpoints.getIncidentEvents.replace('_ID_', orderId),
    })

    const events = result.events.map(event => IncidentEventModel.parse(event))

    return events
  }

  async getContactHistory(input: OrderRequest): Promise<ContactEvent[]> {
    const { orderId } = input

    const result: ContactEvents = await this.restClient.get({
      path: config.apiEndpoints.getContactEvents.replace('_ID_', orderId),
    })

    const events = result.events.map(event => ContactEventModel.parse(event))

    return events
  }

  async getSuspensionOfVisits(input: OrderRequest): Promise<SuspensionOfVisitsEvent[]> {
    const { orderId } = input

    const result: SuspensionOfVisitsEvent[] = await this.restClient.get({
      path: `${config.apiEndpoints.getSuspensionOfVisits}/${orderId}`,
    })

    const events = result.map(event => SuspensionOfVisitsEventModel.parse(event))

    return events
  }
}
