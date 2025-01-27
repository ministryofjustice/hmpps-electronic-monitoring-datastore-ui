import EventsService from './eventsService'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

import { OrderRequest } from '../types/OrderRequest'
import { MonitoringEvent } from '../models/monitoringEvents'
import { IncidentEvent } from '../models/incidentEvents'
import { ContactEvent } from '../models/contactEvents'

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

    const monitoringEventsResponse = [] as MonitoringEvent[]
    const incidentEventsResponse = [] as IncidentEvent[]
    const contactEventsResponse = [] as ContactEvent[]

    const expectedResult = [] as (MonitoringEvent | IncidentEvent | ContactEvent)[]

    it('should return data from the client', async () => {
      datastoreClient.getMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      datastoreClient.getIncidentEvents.mockResolvedValue(incidentEventsResponse)
      datastoreClient.getContactHistory.mockResolvedValue(contactEventsResponse)

      const results = await eventsService.getEvents(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error', async () => {
      datastoreClient.getMonitoringEvents.mockRejectedValue(new Error('some error'))
      datastoreClient.getIncidentEvents.mockRejectedValue(new Error('some error'))
      datastoreClient.getContactHistory.mockRejectedValue(new Error('some error'))

      await expect(eventsService.getEvents(orderRequest)).rejects.toEqual(new Error('some error'))
    })
  })
})
