import nock from 'nock'
import EmDatastoreApiClient from './emDatastoreApiClient'
import orders from './mockData/orders'
import config from '../config'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'
import { OrderRequest } from '../types/OrderRequest'
import { IntegrityEquipmentDetails } from '../models/integrity/equipmentDetails'
import { AlcoholMonitoringEquipmentDetails } from '../models/alcoholMonitoring/equipmentDetails'
import { IntegrityVisitDetails } from '../models/integrity/visitDetails'
import { AlcoholMonitoringVisitDetails } from '../models/alcoholMonitoring/visitDetails'
import { IntegrityServiceDetail } from '../models/integrity/serviceDetail'
import { AlcoholMonitoringServiceDetails } from '../models/alcoholMonitoring/serviceDetails'
import { SuspensionOfVisitsEvent } from '../models/suspensionOfVisits'
import { IntegrityMonitoringEvent } from '../models/integrity/monitoringEvents'
import { IntegrityContactEvent } from '../models/integrity/contactEvents'
import { IntegrityIncidentEvent } from '../models/integrity/incidentEvents'
import { IntegrityViolationEvent } from '../models/integrity/violationEvents'

describe('EM Datastore API Client', () => {
  let fakeClient: nock.Scope
  let emDatastoreApiClient: EmDatastoreApiClient

  const token: string = 'token-1'
  const queryExecutionId: string = 'query-execution-id'
  const queryExecutionResponse: QueryExecutionResponse = {
    queryExecutionId,
  }

  const searchQuery: SearchFormInput = {
    userToken: 'mockUserToken',
    data: {
      searchType: 'am',
      legacySubjectId: '123',
      firstName: 'John',
      lastName: 'Doe',
      alias: 'JD',
      dobDay: '01',
      dobMonth: '01',
      dobYear: '1990',
    },
  }

  const resultsRequest: SearchResultsRequest = {
    userToken: 'mockUserToken',
    queryExecutionId,
  }

  const orderInfo: OrderRequest = {
    userToken: 'user-token',
    legacySubjectId: '7654321',
  }

  beforeEach(() => {
    fakeClient = nock(config.apis.emDatastoreApi.url)
    emDatastoreApiClient = new EmDatastoreApiClient(token)
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  describe('submitSearchQuery', () => {
    it('should return a queryExecutionId from the API', async () => {
      fakeClient
        .post('/integrity/orders', searchQuery.data)
        .matchHeader('Authorization', `Bearer ${token}`)
        .reply(200, queryExecutionResponse)

      const result = await emDatastoreApiClient.submitSearchQuery(searchQuery)

      expect(result).toEqual(queryExecutionResponse)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient.post('/integrity/orders', searchQuery.data).matchHeader('Authorization', `Bearer ${token}`).reply(401)

      await expect(emDatastoreApiClient.submitSearchQuery(searchQuery)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getSearchResults', () => {
    it('should return a list of orders from the API', async () => {
      fakeClient
        .get(`/integrity/orders?id=${queryExecutionId}`)
        .matchHeader('Authorization', `Bearer ${token}`)
        .reply(200, orders)

      const expected = orders

      const result = await emDatastoreApiClient.getSearchResults(resultsRequest)

      expect(result).toEqual(expected)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient
        .get(`/integrity/orders?id=${queryExecutionId}`)
        .matchHeader('Authorization', `Bearer ${token}`)
        .reply(401)

      await expect(emDatastoreApiClient.getSearchResults(resultsRequest)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getIntegritySummary', () => {
    it('should fetch the summary with correct parameters', async () => {
      const expectedResult = {
        keyOrderInformation: {
          specials: 'No',
          legacySubjectId: orderInfo.legacySubjectId,
          legacyOrderId: '7654321',
          name: 'John Smith',
          alias: 'Zeno',
          dateOfBirth: '01-02-1980',
          address1: '1 Primary Street',
          address2: 'Sutton',
          address3: 'London',
          postcode: 'ABC 123',
          orderStartDate: '01-02-2012',
          orderEndDate: '03-04-2013',
        },
        subjectHistoryReport: {
          reportUrl: '#',
          name: '1234567',
          createdOn: '01-02-2020',
          time: '0900',
        },
        documents: {
          pageSize: 0,
          orderDocuments: [] as unknown[],
        },
      }

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegritySummary(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url).get(`/integrity/orders/${orderInfoWithNullToken.legacySubjectId}`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegritySummary(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getAlcoholMonitoringSummary', () => {
    it('should fetch the summary with correct parameters', async () => {
      const expectedResult = {
        keyOrderInformation: {
          specials: 'No',
          legacySubjectId: orderInfo.legacySubjectId,
          legacyOrderId: '7654321',
          name: 'John Smith',
          alias: 'Zeno',
          dateOfBirth: '01-02-1980',
          address1: '1 Primary Street',
          address2: 'Sutton',
          address3: 'London',
          postcode: 'ABC 123',
          orderStartDate: '01-02-2012',
          orderEndDate: '03-04-2013',
        },
        subjectHistoryReport: {
          reportUrl: '#',
          name: '1234567',
          createdOn: '01-02-2020',
          time: '0900',
        },
        documents: {
          pageSize: 0,
          orderDocuments: [] as unknown[],
        },
      }

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/information`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringSummary(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/alcohol-monitoring/${orderInfoWithNullToken.legacySubjectId}/information`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getAlcoholMonitoringSummary(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getIntegrityDetail', () => {
    it('should fetch the details with correct parameters', async () => {
      const expectedResult = {
        specials: 'No',
        legacySubjectId: orderInfo.legacySubjectId,
        legacyOrderId: '7654321',
        firstName: 'John',
        lastName: 'Smith',
        alias: 'Zeno',
        dateOfBirth: '01-02-1980',
        address1: '1 Primary Street',
        address2: 'Sutton',
        address3: 'London',
        postcode: 'ABC 123',
        orderStartDate: '01-02-2012',
        orderEndDate: '03-04-2013',
      }

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegrityDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/integrity/orders/${orderInfoWithNullToken.legacySubjectId}/details`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegrityDetails(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getAlcoholMonitoringDetail', () => {
    it('should fetch the details with correct parameters', async () => {
      const expectedResult = {
        specials: 'No',
        legacySubjectId: orderInfo.legacySubjectId,
        legacyOrderId: '7654321',
        firstName: 'John',
        lastName: 'Smith',
        alias: 'Zeno',
        dateOfBirth: '01-02-1980',
        address1: '1 Primary Street',
        address2: 'Sutton',
        address3: 'London',
        postcode: 'ABC 123',
        orderStartDate: '01-02-2012',
        orderEndDate: '03-04-2013',
      }

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/alcohol-monitoring/${orderInfoWithNullToken.legacySubjectId}/details`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getAlcoholMonitoringDetails(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getIntegrityMonitoringEvents', () => {
    it('should fetch monitoring events with correct parameters', async () => {
      const fakeResponse = [] as IntegrityMonitoringEvent[]
      const expectedResult = [] as IntegrityMonitoringEvent[]

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/monitoring-events`).reply(200, fakeResponse)

      const result = await emDatastoreApiClient.getIntegrityMonitoringEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/integrity/orders/${orderInfoWithNullToken.legacySubjectId}/monitoring-events`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegrityMonitoringEvents(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getContactEvents', () => {
    it('should fetch contact history with correct parameters', async () => {
      const fakeResponse = [] as IntegrityContactEvent[]
      const expectedResult = [] as IntegrityContactEvent[]

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/contact-events`).reply(200, fakeResponse)

      const result = await emDatastoreApiClient.getIntegrityContactEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/integrity/orders/${orderInfoWithNullToken.legacySubjectId}/contact-events`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegrityContactEvents(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getAlcoholMonitoringContactEvents', () => {
    it('should fetch contact history with correct parameters', async () => {
      const fakeResponse = [] as IntegrityContactEvent[]
      const expectedResult = [] as IntegrityContactEvent[]

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/contact-events`).reply(200, fakeResponse)

      const result = await emDatastoreApiClient.getAlcoholMonitoringContactEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/alcohol-monitoring/${orderInfoWithNullToken.legacySubjectId}/contact-events`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getAlcoholMonitoringContactEvents(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getIntegrityIncidentEvents', () => {
    it('should fetch incident events with correct parameters', async () => {
      const fakeResponse = [] as IntegrityIncidentEvent[]
      const expectedResult = [] as IntegrityIncidentEvent[]

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/incident-events`).reply(200, fakeResponse)

      const result = await emDatastoreApiClient.getIntegrityIncidentEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/integrity/orders/${orderInfoWithNullToken.legacySubjectId}/incident-events`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegrityIncidentEvents(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getAlcoholMonitoringIncidentEvents', () => {
    it('should fetch incident events with correct parameters', async () => {
      const fakeResponse = [] as IntegrityIncidentEvent[]
      const expectedResult = [] as IntegrityIncidentEvent[]

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/incident-events`).reply(200, fakeResponse)

      const result = await emDatastoreApiClient.getAlcoholMonitoringIncidentEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/alcohol-monitoring/${orderInfoWithNullToken.legacySubjectId}/incident-events`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getAlcoholMonitoringIncidentEvents(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getIntegrityViolationEvents', () => {
    it('should fetch violation events with correct parameters', async () => {
      const expectedResult = [] as IntegrityViolationEvent[]

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/violation-events`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegrityViolationEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/integrity/orders/${orderInfoWithNullToken.legacySubjectId}/violation-events`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegrityViolationEvents(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getAlcoholMonitoringViolationEvents', () => {
    it('should fetch violation events with correct parameters', async () => {
      const expectedResult = [] as IntegrityViolationEvent[]

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/violation-events`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringViolationEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/alcohol-monitoring/${orderInfoWithNullToken.legacySubjectId}/violation-events`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getAlcoholMonitoringViolationEvents(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getSuspensionOfVisits', () => {
    it('should fetch suspension of visits events', async () => {
      const fakeResponse = [
        {
          legacySubjectId: 1232123,
          suspensionOfVisits: 'test',
          requestedDate: null,
          startDate: null,
          startTime: null,
          endDate: null,
        },
      ] as SuspensionOfVisitsEvent[]
      const expectedResult = fakeResponse
      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/suspension-of-visits`).reply(200, fakeResponse)

      const result = await emDatastoreApiClient.getSuspensionOfVisits(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/integrity/orders/${orderInfoWithNullToken.legacySubjectId}/suspension-of-visits`)
        .reply(401)

      await expect(emDatastoreApiClient.getSuspensionOfVisits(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getInegrityEquipmentDetails', () => {
    it('should fetch list of equipment details', async () => {
      const expectedResult = [
        {
          legacySubjectId: 123,
        },
      ]

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegrityEquipmentDetails(orderInfo)

      expect(result).toEqual(expectedResult as IntegrityEquipmentDetails[])
    })

    it('should fetch list of equipment details', async () => {
      const expectedResult = [] as IntegrityEquipmentDetails[]

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegrityEquipmentDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/integrity/orders/${orderInfoWithNullToken.legacySubjectId}/equipment-details`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegrityEquipmentDetails(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getAlcoholMonitoringEquipmentDetails', () => {
    it('should fetch list of equipment details', async () => {
      const expectedResult: AlcoholMonitoringEquipmentDetails[] = [
        {
          legacySubjectId: '123',
        },
      ]

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringEquipmentDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of equipment details', async () => {
      const expectedResult: AlcoholMonitoringEquipmentDetails[] = []

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/equipment-details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringEquipmentDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      nock(config.apis.emDatastoreApi.url)
        .get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/equipment-details`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getAlcoholMonitoringEquipmentDetails(orderInfo)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getIntegrityVisitDetails', () => {
    it('should fetch list of visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: 123,
          address: {
            addressLine1: 'address line 1',
            addressLine2: 'address line 2',
            addressLine3: 'address line 3',
            addressLine4: null,
            postcode: 'address line 3',
          },
          actualWorkStartDateTime: '2001-01-01T01:01:01',
          actualWorkEndDateTime: '2002-02-02T02:02:02',
          visitNotes: 'TEST_NOTES',
          visitType: 'TEST_VISIT_TYPE',
          visitOutcome: 'TEST_OUTCOME',
        },
      ] as IntegrityVisitDetails[]

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegrityVisitDetails(orderInfo)

      expect(result).toEqual(expectedResult as IntegrityVisitDetails[])
    })

    it('should fetch list of visit details', async () => {
      const expectedResult = [] as IntegrityVisitDetails[]

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegrityVisitDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/integrity/orders/${orderInfoWithNullToken.legacySubjectId}/visit-details`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegrityVisitDetails(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getAlcoholMonitoringVisitDetails', () => {
    it('should fetch list of visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          visitId: '300',
          visitType: 'visit type',
          visitAttempt: 'attempt 1',
          dateVisitRaised: '2001-01-01T00:00:00',
          visitAddress: 'test visit address',
          visitNotes: 'visit notes',
          visitOutcome: 'visit outcome',
          actualWorkStartDateTime: '2002-02-02T02:20:20',
          actualWorkEndDateTime: '2003-03-03T03:30:30',
          visitRejectionReason: 'rejection reason',
          visitRejectionDescription: 'rejection description',
          visitCancelReason: 'cancel reason',
          visitCancelDescription: 'cancel description',
        },
      ] as AlcoholMonitoringVisitDetails[]

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringVisitDetails(orderInfo)

      expect(result).toEqual(expectedResult as AlcoholMonitoringVisitDetails[])
    })

    it('should fetch list of visit details', async () => {
      const expectedResult = [] as AlcoholMonitoringVisitDetails[]

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/visit-details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringVisitDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/alcohol-monitoring/${orderInfoWithNullToken.legacySubjectId}/visit-details`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getAlcoholMonitoringVisitDetails(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getIntegrityServiceDetails', () => {
    it('should fetch all service details', async () => {
      const expectedResult = [
        {
          legacySubjectId: 123,
          serviceId: 321,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostcode: 'postcode',
          serviceStartDate: '2002-05-22T01:01:01',
          serviceEndDate: '2002-05-22T01:01:01',
          curfewStartDate: '2002-05-22T01:01:01',
          curfewEndDate: '2002-05-22T01:01:01',
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 7,
        },
      ] as IntegrityServiceDetail[]

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegrityServiceDetails(orderInfo)

      expect(result).toEqual(expectedResult as IntegrityServiceDetail[])
    })

    it('should fetch an empty list of service details', async () => {
      const expectedResult = [] as IntegrityServiceDetail[]

      fakeClient.get(`/integrity/orders/${orderInfo.legacySubjectId}/service-details`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getIntegrityServiceDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        legacySubjectId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`/integrity/orders/${orderInfoWithNullToken.legacySubjectId}/service-details`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIntegrityServiceDetails(orderInfoWithNullToken)).rejects.toThrow(
        'Unauthorized',
      )
    })
  })

  describe('getAlcoholMonitoringServiceDetails', () => {
    it('should fetch a list of one service detail item', async () => {
      const expectedResult: AlcoholMonitoringServiceDetails[] = [
        {
          legacySubjectId: '123',
        },
      ]

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/services`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringServiceDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple service detail items', async () => {
      const expectedResult: AlcoholMonitoringServiceDetails[] = [
        {
          legacySubjectId: '123',
        },
        {
          legacySubjectId: '456',
        },
        {
          legacySubjectId: '789',
        },
      ]

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/services`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringServiceDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of service details', async () => {
      const expectedResult: AlcoholMonitoringServiceDetails[] = []

      fakeClient.get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/services`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getAlcoholMonitoringServiceDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('Does not catch unauthorised errors from API', async () => {
      nock(config.apis.emDatastoreApi.url).get(`/alcohol-monitoring/${orderInfo.legacySubjectId}/services`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getAlcoholMonitoringServiceDetails(orderInfo)).rejects.toThrow('Unauthorized')
    })
  })
})
