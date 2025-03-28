import nock from 'nock'
import EmDatastoreApiClient from './emDatastoreApiClient'
import orders from './mockData/orders'
import config from '../config'
import { SearchFormInput, SearchResultsRequest } from '../types/Search'
import { OrderRequest } from '../types/OrderRequest'
import mockOrderInformation from './mockData/orderInformation'
import { MonitoringEvent } from '../models/monitoringEvents'
import { ContactEvent } from '../models/contactEvents'
import { IncidentEvent } from '../models/incidentEvents'
import { ViolationEvent } from '../models/violationEvents'
import { EquipmentDetails } from '../models/equipmentDetails'
import { VisitDetails } from '../models/visitDetails'
import { CurfewTimetable } from '../models/curfewTimetable'
import { SuspensionOfVisitsEvent } from '../models/suspensionOfVisits'
import { QueryExecutionResponse } from '../interfaces/QueryExecutionResponse'

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
    orderId: '7654321',
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
    const endpoint = config.apiEndpoints.searchOrders

    it('should return a queryExecutionId from the API', async () => {
      fakeClient
        .post(endpoint, searchQuery.data)
        .matchHeader('Authorization', `Bearer ${token}`)
        .reply(200, queryExecutionResponse)

      const result = await emDatastoreApiClient.submitSearchQuery(searchQuery)

      expect(result).toEqual(queryExecutionResponse)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient.post(endpoint, searchQuery.data).matchHeader('Authorization', `Bearer ${token}`).reply(401)

      await expect(emDatastoreApiClient.submitSearchQuery(searchQuery)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getSearchResults', () => {
    const endpoint = `${config.apiEndpoints.searchOrders}/${queryExecutionId}`

    it('should return a list of orders from the API', async () => {
      fakeClient.post(endpoint).matchHeader('Authorization', `Bearer ${token}`).reply(200, orders)

      const expected = orders

      const result = await emDatastoreApiClient.getSearchResults(resultsRequest)

      expect(result).toEqual(expected)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient.post(endpoint).matchHeader('Authorization', `Bearer ${token}`).reply(401)

      await expect(emDatastoreApiClient.getSearchResults(resultsRequest)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getOrderSummary', () => {
    const endpoint = '/orders/getOrderSummary'

    it('should fetch order summary with correct parameters', async () => {
      const expectedResult = mockOrderInformation

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getOrderSummary(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url).get(`${endpoint}/${orderInfoWithNullToken.orderId}`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getOrderSummary(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getMonitoringEvents', () => {
    const endpoint = '/orders/getMonitoringEvents'

    it('should fetch monitoring events with correct parameters', async () => {
      const fakeResponse = [] as MonitoringEvent[]
      const expectedResult = [] as MonitoringEvent[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, fakeResponse)

      const result = await emDatastoreApiClient.getMonitoringEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url).get(`${endpoint}/${orderInfoWithNullToken.orderId}`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getMonitoringEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getContactEvents', () => {
    const endpoint = '/orders/getContactEvents'

    it('should fetch contact history with correct parameters', async () => {
      const fakeResponse = [] as ContactEvent[]
      const expectedResult = [] as ContactEvent[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, fakeResponse)

      const result = await emDatastoreApiClient.getContactEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url).get(`${endpoint}/${orderInfoWithNullToken.orderId}`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getContactEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getIncidentEvents', () => {
    const endpoint = '/orders/getIncidentEvents'

    it('should fetch incident events with correct parameters', async () => {
      const fakeResponse = [] as IncidentEvent[]
      const expectedResult = [] as IncidentEvent[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, fakeResponse)

      const result = await emDatastoreApiClient.getIncidentEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url).get(`${endpoint}/${orderInfoWithNullToken.orderId}`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getIncidentEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getViolationEvents', () => {
    const endpoint = '/orders/getViolationEvents'

    it('should fetch violation events with correct parameters', async () => {
      const expectedResult = [] as ViolationEvent[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getViolationEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url).get(`${endpoint}/${orderInfoWithNullToken.orderId}`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getViolationEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
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
      fakeClient.get(`${config.apiEndpoints.getSuspensionOfVisits}/${orderInfo.orderId}`).reply(200, fakeResponse)

      const result = await emDatastoreApiClient.getSuspensionOfVisits(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url)
        .get(`${config.apiEndpoints.getSuspensionOfVisits}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      await expect(emDatastoreApiClient.getSuspensionOfVisits(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getEquipmentDetails', () => {
    const endpoint = '/orders/getEquipmentDetails'

    it('should fetch list of equipment details', async () => {
      const expectedResult = [
        {
          legacySubjectId: 123,
          legacyOrderId: 321,
        },
      ]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getEquipmentDetails(orderInfo)

      expect(result).toEqual(expectedResult as EquipmentDetails[])
    })

    it('should fetch list of equipment details', async () => {
      const expectedResult = [] as EquipmentDetails[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getEquipmentDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url).get(`${endpoint}/${orderInfoWithNullToken.orderId}`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getEquipmentDetails(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getVisitDetails', () => {
    const endpoint = '/orders/getVisitDetails'

    it('should fetch list of visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: 123,
          legacyOrderId: 321,
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
      ] as VisitDetails[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getVisitDetails(orderInfo)

      expect(result).toEqual(expectedResult as VisitDetails[])
    })

    it('should fetch list of visit details', async () => {
      const expectedResult = [] as VisitDetails[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getVisitDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url).get(`${endpoint}/${orderInfoWithNullToken.orderId}`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getVisitDetails(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getCurfewTimetable', () => {
    const endpoint = '/orders/getCurfewTimetable'

    it('should fetch all curfew timetables', async () => {
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
      ] as CurfewTimetable[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getCurfewTimetable(orderInfo)

      expect(result).toEqual(expectedResult as CurfewTimetable[])
    })

    it('should fetch an empty list of curfew timetables', async () => {
      const expectedResult = [] as CurfewTimetable[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await emDatastoreApiClient.getCurfewTimetable(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.emDatastoreApi.url).get(`${endpoint}/${orderInfoWithNullToken.orderId}`).reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(emDatastoreApiClient.getCurfewTimetable(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })
})
