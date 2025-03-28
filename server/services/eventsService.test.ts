import EventsService from './eventsService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { MonitoringEvent } from '../models/monitoringEvents'
import { IncidentEvent } from '../models/incidentEvents'
import { ContactEvent } from '../models/contactEvents'
import { ViolationEvent } from '../models/violationEvents'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/emDatastoreApiClient')

describe('Events Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let eventsService: EventsService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    eventsService = new EventsService(emDatastoreApiClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEvents', () => {
    const orderRequest: OrderRequest = {
      orderId: '123',
    }

    const monitoringEventsResponse = [] as MonitoringEvent[]
    const incidentEventsResponse = [] as IncidentEvent[]
    const contactEventsResponse = [] as ContactEvent[]
    const violationEventsResponse = [] as ViolationEvent[]

    const expectedResult = [] as (MonitoringEvent | IncidentEvent | ContactEvent | ViolationEvent)[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      emDatastoreApiClient.getIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getViolationEvents.mockResolvedValue(violationEventsResponse)

      const results = await eventsService.getEvents(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting monitoring events', async () => {
      emDatastoreApiClient.getMonitoringEvents.mockRejectedValue(new Error('some error'))
      emDatastoreApiClient.getIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(eventsService.getEvents(orderRequest)).rejects.toEqual(new Error('some error'))
    })

    it('should propagate an error if there is an error getting incident events', async () => {
      emDatastoreApiClient.getMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      emDatastoreApiClient.getIncidentEvents.mockRejectedValue(new Error('some error'))
      emDatastoreApiClient.getContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(eventsService.getEvents(orderRequest)).rejects.toEqual(new Error('some error'))
    })

    it('should propagate an error if there is an error getting contact events', async () => {
      emDatastoreApiClient.getMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      emDatastoreApiClient.getIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getContactEvents.mockRejectedValue(new Error('some error'))
      emDatastoreApiClient.getViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(eventsService.getEvents(orderRequest)).rejects.toEqual(new Error('some error'))
    })

    it('should propagate an error if there is an error getting violation events', async () => {
      emDatastoreApiClient.getMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      emDatastoreApiClient.getIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getViolationEvents.mockRejectedValue(new Error('some error'))

      await expect(eventsService.getEvents(orderRequest)).rejects.toEqual(new Error('some error'))
    })
  })
})
