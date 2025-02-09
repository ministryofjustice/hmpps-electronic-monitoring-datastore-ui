import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import { Order } from '../interfaces/order'
import { SearchFormInput } from '../types/SearchFormInput'
import { OrderRequest } from '../types/OrderRequest'
import { OrderDetails } from '../interfaces/orderDetails'
import { OrderInformation } from '../interfaces/orderInformation'
import { ContactEventModel, ContactEvent } from '../models/contactEvents'
import { IncidentEventModel, IncidentEvent } from '../models/incidentEvents'
import { MonitoringEventModel, MonitoringEvent } from '../models/monitoringEvents'
import { ViolationEventModel, ViolationEvent } from '../models/violationEvents'
import { EquipmentDetailsModel, EquipmentDetails } from '../models/equipmentDetail'

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

    const result: MonitoringEvent[] = await this.restClient.get({
      path: `${config.apiEndpoints.getMonitoringEvents}/${orderId}`,
    })

    const events = result.map(event => MonitoringEventModel.parse(event))

    return events
  }

  async getIncidentEvents(input: OrderRequest): Promise<IncidentEvent[]> {
    const { orderId } = input

    const result: IncidentEvent[] = await this.restClient.get({
      path: `${config.apiEndpoints.getIncidentEvents}/${orderId}`,
    })

    const events = result.map(event => IncidentEventModel.parse(event))

    return events
  }

  async getViolationEvents(input: OrderRequest): Promise<ViolationEvent[]> {
    const { orderId } = input

    const result: ViolationEvent[] = await this.restClient.get({
      path: `${config.apiEndpoints.getViolationEvents}/${orderId}`,
    })

    const events = result.map(event => ViolationEventModel.parse(event))

    return events
  }

  async getContactEvents(input: OrderRequest): Promise<ContactEvent[]> {
    const { orderId } = input

    const result: ContactEvent[] = await this.restClient.get({
      path: `${config.apiEndpoints.getContactEvents}/${orderId}`,
    })

    const events = result.map(event => ContactEventModel.parse(event))

    return events
  }

  async getEquipmentDetails(input: OrderRequest): Promise<EquipmentDetails[]> {
    const { orderId } = input

    const result: EquipmentDetails[] = await this.restClient.get({
      path: `${config.apiEndpoints.getEquipmentDetails}/${orderId}`,
    })

    const equipmentDetails = result.map(data => EquipmentDetailsModel.parse(data))

    return equipmentDetails
  }
}
