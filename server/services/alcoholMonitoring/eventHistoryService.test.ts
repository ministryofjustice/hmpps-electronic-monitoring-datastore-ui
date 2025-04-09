import AlcoholMonitoringEventHistoryService from './eventHistoryService'
import { createMockHmppsAuthClient, createEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { AlcoholMonitoringIncidentEvent } from '../../models/alcoholMonitoring/incidentEvents'
import { AlcoholMonitoringContactEvent } from '../../models/alcoholMonitoring/contactEvents'
import { AlcoholMonitoringViolationEvent } from '../../models/alcoholMonitoring/violationEvents'

jest.mock('../../data/hmppsAuthClient')
jest.mock('../../data/emDatastoreApiClient')

describe('Alcohol Monitoring Event History Service', () => {
  const token = 'fake-token-value'
  const hmppsAuthClient = createMockHmppsAuthClient()
  const emDatastoreApiClient = createEmDatastoreApiClient()

  const emDatastoreApiClientFactory = jest.fn()

  let alcoholMonitoringEventHistoryService: AlcoholMonitoringEventHistoryService

  beforeEach(() => {
    emDatastoreApiClientFactory.mockReturnValue(emDatastoreApiClient)
    alcoholMonitoringEventHistoryService = new AlcoholMonitoringEventHistoryService(
      emDatastoreApiClientFactory,
      hmppsAuthClient,
    )
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEvents', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const incidentEventsResponse = [] as AlcoholMonitoringIncidentEvent[]
    const contactEventsResponse = [] as AlcoholMonitoringContactEvent[]
    const violationEventsResponse = [] as AlcoholMonitoringViolationEvent[]

    const expectedResult = [] as (
      | AlcoholMonitoringIncidentEvent
      | AlcoholMonitoringContactEvent
      | AlcoholMonitoringViolationEvent
    )[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getAlcoholMonitoringIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getAlcoholMonitoringContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getAlcoholMonitoringViolationEvents.mockResolvedValue(violationEventsResponse)

      const results = await alcoholMonitoringEventHistoryService.getEventHistory(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting incident events', async () => {
      emDatastoreApiClient.getAlcoholMonitoringIncidentEvents.mockRejectedValue(new Error('some error'))
      emDatastoreApiClient.getAlcoholMonitoringContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getAlcoholMonitoringViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(alcoholMonitoringEventHistoryService.getEventHistory(orderRequest)).rejects.toEqual(
        new Error('Error retrieving event history: some error'),
      )
    })

    it('should propagate an error if there is an error getting contact events', async () => {
      emDatastoreApiClient.getAlcoholMonitoringIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getAlcoholMonitoringContactEvents.mockRejectedValue(new Error('some error'))
      emDatastoreApiClient.getAlcoholMonitoringViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(alcoholMonitoringEventHistoryService.getEventHistory(orderRequest)).rejects.toEqual(
        new Error('Error retrieving event history: some error'),
      )
    })

    it('should propagate an error if there is an error getting violation events', async () => {
      emDatastoreApiClient.getAlcoholMonitoringIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getAlcoholMonitoringContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getAlcoholMonitoringViolationEvents.mockRejectedValue(new Error('some error'))

      await expect(alcoholMonitoringEventHistoryService.getEventHistory(orderRequest)).rejects.toEqual(
        new Error('Error retrieving event history: some error'),
      )
    })
  })
})
