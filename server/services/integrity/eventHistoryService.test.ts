import IntegrityEventHistoryService from './eventHistoryService'
import { createMockEmDatastoreApiClient } from '../../data/testUtils/mocks'

import { OrderRequest } from '../../types/OrderRequest'
import { IntegrityMonitoringEvent } from '../../models/integrity/monitoringEvents'
import { IntegrityIncidentEvent } from '../../models/integrity/incidentEvents'
import { IntegrityContactEvent } from '../../models/integrity/contactEvents'
import { IntegrityViolationEvent } from '../../models/integrity/violationEvents'

jest.mock('../../data/emDatastoreApiClient')

describe('Integrity Event History Service', () => {
  const emDatastoreApiClient = createMockEmDatastoreApiClient()

  let integrityEventHistoryService: IntegrityEventHistoryService

  beforeEach(() => {
    integrityEventHistoryService = new IntegrityEventHistoryService(emDatastoreApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getEvents', () => {
    const orderRequest: OrderRequest = {
      legacySubjectId: '123',
    }

    const monitoringEventsResponse = [] as IntegrityMonitoringEvent[]
    const incidentEventsResponse = [] as IntegrityIncidentEvent[]
    const contactEventsResponse = [] as IntegrityContactEvent[]
    const violationEventsResponse = [] as IntegrityViolationEvent[]

    const expectedResult = [] as (
      | IntegrityMonitoringEvent
      | IntegrityIncidentEvent
      | IntegrityContactEvent
      | IntegrityViolationEvent
    )[]

    it('should return data from the client', async () => {
      emDatastoreApiClient.getIntegrityMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      emDatastoreApiClient.getIntegrityIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getIntegrityContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getIntegrityViolationEvents.mockResolvedValue(violationEventsResponse)

      const results = await integrityEventHistoryService.getEventHistory(orderRequest)

      expect(results).toEqual(expectedResult)
    })

    it('should propagate an error if there is an error getting monitoring events', async () => {
      emDatastoreApiClient.getIntegrityMonitoringEvents.mockRejectedValue(new Error('some error'))
      emDatastoreApiClient.getIntegrityIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getIntegrityContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getIntegrityViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(integrityEventHistoryService.getEventHistory(orderRequest)).rejects.toEqual(
        new Error('Error retrieving event history: some error'),
      )
    })

    it('should propagate an error if there is an error getting incident events', async () => {
      emDatastoreApiClient.getIntegrityMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      emDatastoreApiClient.getIntegrityIncidentEvents.mockRejectedValue(new Error('some error'))
      emDatastoreApiClient.getIntegrityContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getIntegrityViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(integrityEventHistoryService.getEventHistory(orderRequest)).rejects.toEqual(
        new Error('Error retrieving event history: some error'),
      )
    })

    it('should propagate an error if there is an error getting contact events', async () => {
      emDatastoreApiClient.getIntegrityMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      emDatastoreApiClient.getIntegrityIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getIntegrityContactEvents.mockRejectedValue(new Error('some error'))
      emDatastoreApiClient.getIntegrityViolationEvents.mockResolvedValue(violationEventsResponse)

      await expect(integrityEventHistoryService.getEventHistory(orderRequest)).rejects.toEqual(
        new Error('Error retrieving event history: some error'),
      )
    })

    it('should propagate an error if there is an error getting violation events', async () => {
      emDatastoreApiClient.getIntegrityMonitoringEvents.mockResolvedValue(monitoringEventsResponse)
      emDatastoreApiClient.getIntegrityIncidentEvents.mockResolvedValue(incidentEventsResponse)
      emDatastoreApiClient.getIntegrityContactEvents.mockResolvedValue(contactEventsResponse)
      emDatastoreApiClient.getIntegrityViolationEvents.mockRejectedValue(new Error('some error'))

      await expect(integrityEventHistoryService.getEventHistory(orderRequest)).rejects.toEqual(
        new Error('Error retrieving event history: some error'),
      )
    })
  })
})
