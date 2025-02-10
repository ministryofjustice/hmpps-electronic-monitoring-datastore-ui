import nock from 'nock'
import DatastoreClient from './datastoreClient'
import orders from './mockData/orders'
import config from '../config'
import { Order } from '../interfaces/order'
import { SearchFormInput } from '../types/SearchFormInput'
import { OrderRequest } from '../types/OrderRequest'
import mockOrderInformation from './mockData/orderInformation'
import { MonitoringEvent } from '../models/monitoringEvents'
import { ContactEvent } from '../models/contactEvents'
import { IncidentEvent } from '../models/incidentEvents'
import { ViolationEvent } from '../models/violationEvents'
import { EquipmentDetails } from '../models/equipmentDetails'
import { VisitDetails } from '../models/visitDetails'
import { SuspensionOfVisits } from '../models/suspensionOfVisits'

describe('EM Datastore Search Client', () => {
  let fakeClient: nock.Scope
  let datastoreClient: DatastoreClient

  const token = 'token-1'

  const searchOrder: SearchFormInput = {
    userToken: 'mockUserToken',
    data: {
      searchType: 'am',
      legacySubjectId: '123',
      firstName: 'John',
      lastName: 'Doe',
      alias: 'JD',
      'dob-day': '01',
      'dob-month': '01',
      'dob-year': '1990',
    },
  }

  const orderInfo: OrderRequest = {
    userToken: 'user-token',
    orderId: '7654321',
  }

  beforeEach(() => {
    fakeClient = nock(config.apis.electronicMonitoringDatastore.url)
    datastoreClient = new DatastoreClient(token)
  })

  afterEach(() => {
    if (!nock.isDone()) {
      nock.cleanAll()
      throw new Error('Not all nock interceptors were used!')
    }
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  describe('searchOrders', () => {
    const endpoint = '/search/orders'

    it('should return a list of orders from the API', async () => {
      fakeClient.post(endpoint, searchOrder.data).matchHeader('Authorization', `Bearer ${token}`).reply(200, orders)

      const expected: Order[] = orders

      const results = await datastoreClient.searchOrders(searchOrder)

      expect(results).toEqual(expected)
    })

    it('should handle 401 Unauthorized when the user token is invalid', async () => {
      fakeClient.post(endpoint, searchOrder.data).matchHeader('Authorization', `Bearer ${token}`).reply(401)

      await expect(datastoreClient.searchOrders(searchOrder)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getOrderSummary', () => {
    const endpoint = '/orders/getOrderSummary'

    it('should fetch order summary with correct parameters', async () => {
      const expectedResult = mockOrderInformation

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getOrderSummary(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getOrderSummary(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getMonitoringEvents', () => {
    const endpoint = '/orders/getMonitoringEvents'

    it('should fetch monitoring events with correct parameters', async () => {
      const expectedResult = [] as MonitoringEvent[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getMonitoringEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getMonitoringEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getContactEvents', () => {
    const endpoint = '/orders/getContactEvents'

    it('should fetch contact history with correct parameters', async () => {
      const expectedResult = [] as ContactEvent[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getContactEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getContactEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getIncidentEvents', () => {
    const endpoint = '/orders/getIncidentEvents'

    it('should fetch incident events with correct parameters', async () => {
      const expectedResult = [] as IncidentEvent[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getIncidentEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getIncidentEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getViolationEvents', () => {
    const endpoint = '/orders/getViolationEvents'

    it('should fetch violation events with correct parameters', async () => {
      const expectedResult = [] as ViolationEvent[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getViolationEvents(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getViolationEvents(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
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

      const result = await datastoreClient.getEquipmentDetails(orderInfo)

      expect(result).toEqual(expectedResult as EquipmentDetails[])
    })

    it('should fetch list of equipment details', async () => {
      const expectedResult = [] as EquipmentDetails[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getEquipmentDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getEquipmentDetails(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
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

      const result = await datastoreClient.getVisitDetails(orderInfo)

      expect(result).toEqual(expectedResult as VisitDetails[])
    })

    it('should fetch list of visit details', async () => {
      const expectedResult = [] as VisitDetails[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getVisitDetails(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getVisitDetails(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })

  describe('getSuspensionOfVisits', () => {
    const endpoint = '/orders/getSuspensionOfVisits'

    it('should fetch all suspensions of visits', async () => {
      const expectedResult = [
        {
          legacySubjectId: 123,
          suspensionOfVisits: 'Yes',
          suspensionOfVisitsRequestedDate: '2022-02-02T01:01:01',
          suspensionOfVisitsStartDate: '2022-02-02T02:02:02',
          suspensionOfVisitsEndDate: '2022-02-02T03:03:03',
        },
      ] as SuspensionOfVisits[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getSuspensionOfVisits(orderInfo)

      expect(result).toEqual(expectedResult as SuspensionOfVisits[])
    })

    it('should fetch an empty list of suspensions of visits', async () => {
      const expectedResult = [] as SuspensionOfVisits[]

      fakeClient.get(`${endpoint}/${orderInfo.orderId}`).reply(200, expectedResult)

      const result = await datastoreClient.getSuspensionOfVisits(orderInfo)

      expect(result).toEqual(expectedResult)
    })

    it('handles null user tokens correctly by expecting Unauthorized', async () => {
      // Create orderInfo with userToken explicitly set to null
      const orderInfoWithNullToken: OrderRequest = {
        orderId: '123',
        userToken: null,
      }

      nock(config.apis.electronicMonitoringDatastore.url)
        .get(`${endpoint}/${orderInfoWithNullToken.orderId}`)
        .reply(401)

      // Expect the method call to throw due to unauthorized access
      await expect(datastoreClient.getSuspensionOfVisits(orderInfoWithNullToken)).rejects.toThrow('Unauthorized')
    })
  })
})
