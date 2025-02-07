import EventsService from './eventsService'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { MonitoringEvent, MonitoringEvents } from '../models/monitoringEvents'
import { IncidentEvent, IncidentEvents } from '../models/incidentEvents'
import { ContactEvent, ContactEvents } from '../models/contactEvents'
import { ViolationEvent, ViolationEvents } from '../models/violationEvents'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/datastoreClient')

describe('Events Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const datastoreClient = createDatastoreClient()

  const datastoreClientFactory = jest.fn()

  let eventsService: EventsService

  beforeEach(() => {
    datastoreClientFactory.mockReturnValue(datastoreClient)
    eventsService = new EventsService(datastoreClientFactory, hmppsAuthClient)
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEvents', () => {
    const orderRequest: OrderRequest = {
      orderId: '123',
    }

    const monitoringEventsResponse = [] as MonitoringEvents
    const incidentEventsResponse = [] as IncidentEvents
    const contactEventsResponse = [] as ContactEvents
    const violationEventsResponse = [] as ViolationEvents

    const expectedResult = [] as (MonitoringEvent | IncidentEvent | ContactEvent | ViolationEvent)[]

    it('should return data from the client', async () => {
      datastoreClient.getMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      datastoreClient.getIncidentEvents.mockResolvedValue(incidentEventsResponse)
      datastoreClient.getContactEvents.mockResolvedValue(contactEventsResponse)
      datastoreClient.getViolationEvents.mockResolvedValue(violationEventsResponse)

      const results = await eventsService.getEvents(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting monitoring events', async () => {
      datastoreClient.getMonitoringEvents.mockRejectedValue(new Error('some error'))
      datastoreClient.getIncidentEvents.mockResolvedValue(incidentEventsResponse)
      datastoreClient.getContactEvents.mockResolvedValue(contactEventsResponse)
      datastoreClient.getViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(eventsService.getEvents(orderRequest)).rejects.toEqual(new Error('some error'))
    })

    it('should propagate an error if there is an error getting incident events', async () => {
      datastoreClient.getMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      datastoreClient.getIncidentEvents.mockRejectedValue(new Error('some error'))
      datastoreClient.getContactEvents.mockResolvedValue(contactEventsResponse)
      datastoreClient.getViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(eventsService.getEvents(orderRequest)).rejects.toEqual(new Error('some error'))
    })

    it('should propagate an error if there is an error getting contact events', async () => {
      datastoreClient.getMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      datastoreClient.getIncidentEvents.mockResolvedValue(incidentEventsResponse)
      datastoreClient.getContactEvents.mockRejectedValue(new Error('some error'))
      datastoreClient.getViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(eventsService.getEvents(orderRequest)).rejects.toEqual(new Error('some error'))
    })

    it('should propagate an error if there is an error getting violation events', async () => {
      datastoreClient.getMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      datastoreClient.getIncidentEvents.mockResolvedValue(incidentEventsResponse)
      datastoreClient.getContactEvents.mockResolvedValue(contactEventsResponse)
      datastoreClient.getViolationEvents.mockRejectedValue(new Error('some error'))

      await expect(eventsService.getEvents(orderRequest)).rejects.toEqual(new Error('some error'))
    })
  })
})
