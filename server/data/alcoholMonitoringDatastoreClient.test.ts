import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import AlcoholMonitoringDatastoreClient from './alcoholMonitoringDatastoreClient'
import { MockServer } from '../testutils/mockServer'
import config from '../config'

import { AlcoholMonitoringEquipmentDetails } from './models/alcoholMonitoringEquipmentDetails'
import { AlcoholMonitoringIncidentEvent } from './models/alcoholMonitoringIncidentEvent'
import { AlcoholMonitoringContactEvent } from './models/alcoholMonitoringContactEvent'
import { AlcoholMonitoringViolationEvent } from './models/alcoholMonitoringViolationEvent'
import { AlcoholMonitoringOrderDetails } from './models/alcoholMonitoringOrderDetails'
import { AlcoholMonitoringServiceDetails } from './models/alcoholMonitoringServiceDetails'
import { AlcoholMonitoringVisitDetails } from './models/alcoholMonitoringVisitDetails'

const mockServer = new MockServer(config.apis.alcoholMonitoringDatastoreApi.url)

describe('Alcohol Monitoring Datastore Client', () => {
  let datastoreApiClient: AlcoholMonitoringDatastoreClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    datastoreApiClient = new AlcoholMonitoringDatastoreClient(mockAuthenticationClient)
  })

  afterEach(() => {
    mockServer.clearMocks()
    jest.resetAllMocks()
  })

  describe('getEquipmentDetails', () => {
    const legacySubjectId = '123'

    it('should fetch list of equipment details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          deviceType: null,
          deviceSerialNumber: null,
          deviceAddressType: null,
          legFitting: null,
          deviceInstalledDateTime: null,
          deviceRemovedDateTime: null,
          hmuInstallDateTime: null,
          hmuRemovedDateTime: null,
        } as AlcoholMonitoringEquipmentDetails,
      ]
      mockServer.withMockedGetResponse(
        `/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`,
        expectedResult,
      )

      const result = await datastoreApiClient.getEquipmentDetails(legacySubjectId, 'test-system-token')

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          deviceType: null,
          deviceSerialNumber: null,
          deviceAddressType: null,
          legFitting: null,
          deviceInstalledDateTime: null,
          deviceRemovedDateTime: null,
          hmuInstallDateTime: null,
          hmuRemovedDateTime: null,
        } as AlcoholMonitoringEquipmentDetails,
        {
          legacySubjectId: '456',
          deviceType: null,
          deviceSerialNumber: null,
          deviceAddressType: null,
          legFitting: null,
          deviceInstalledDateTime: null,
          deviceRemovedDateTime: null,
          hmuInstallDateTime: null,
          hmuRemovedDateTime: null,
        } as AlcoholMonitoringEquipmentDetails,
        {
          legacySubjectId: '789',
          deviceType: null,
          deviceSerialNumber: null,
          deviceAddressType: null,
          legFitting: null,
          deviceInstalledDateTime: null,
          deviceRemovedDateTime: null,
          hmuInstallDateTime: null,
          hmuRemovedDateTime: null,
        } as AlcoholMonitoringEquipmentDetails,
      ]
      mockServer.withMockedGetResponse(
        `/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`,
        expectedResult,
      )

      const result = await datastoreApiClient.getEquipmentDetails(legacySubjectId, 'test-system-token')

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of equipment details', async () => {
      const expectedResult = [] as AlcoholMonitoringEquipmentDetails[]
      mockServer.withMockedGetResponse(
        `/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`,
        expectedResult,
      )

      const result = await datastoreApiClient.getEquipmentDetails(legacySubjectId, 'test-system-token')

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      mockServer.withMockedAuthErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`)

      await expect(datastoreApiClient.getEquipmentDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      mockServer.withMockedServerErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/equipment-details`)

      await expect(datastoreApiClient.getEquipmentDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('getIncidentEvents', () => {
    it('should fetch incident event history when there is only one event', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      const incidentEventsResponse = [
        {
          legacySubjectId,
          type: 'incident',
          dateTime: '2003-03-03T03:03:03',
          details: {
            violationAlertId: null,
            violationAlertDateTime: null,
            violationAlertType: null,
            violationAlertResponseAction: null,
            visitRequired: null,
            probationInteractionRequired: null,
            amsInteractionRequired: null,
            multipleAlerts: null,
            additionalAlerts: null,
          },
        } as AlcoholMonitoringIncidentEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/alcohol-monitoring/${legacySubjectId}/incident-events`,
        incidentEventsResponse,
      )

      const result = await datastoreApiClient.getIncidentEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(incidentEventsResponse)
    })

    it('should fetch incident event history when there are more than one event', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      const incidentEventsResponse = [
        {
          legacySubjectId,
          type: 'incident',
          dateTime: '2003-03-03T03:03:03',
          details: {
            violationAlertId: null,
            violationAlertDateTime: null,
            violationAlertType: null,
            violationAlertResponseAction: null,
            visitRequired: null,
            probationInteractionRequired: null,
            amsInteractionRequired: null,
            multipleAlerts: null,
            additionalAlerts: null,
          },
        } as AlcoholMonitoringIncidentEvent,
        {
          legacySubjectId,
          type: 'incident',
          dateTime: '2003-03-03T03:03:03',
          details: {
            violationAlertId: null,
            violationAlertDateTime: null,
            violationAlertType: null,
            violationAlertResponseAction: null,
            visitRequired: null,
            probationInteractionRequired: null,
            amsInteractionRequired: null,
            multipleAlerts: null,
            additionalAlerts: null,
          },
        } as AlcoholMonitoringIncidentEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/alcohol-monitoring/${legacySubjectId}/incident-events`,
        incidentEventsResponse,
      )

      const result = await datastoreApiClient.getIncidentEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(incidentEventsResponse)
    })

    it('should fetch incident event history when there are no events', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`, [])

      const result = await datastoreApiClient.getIncidentEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual([])
    })

    it('should return unauthorized error when fetching incident event history without proper auth', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedAuthErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`)

      await expect(datastoreApiClient.getIncidentEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should return internal server error when fetching incident event history when server fails', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedServerErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/incident-events`)

      await expect(datastoreApiClient.getIncidentEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('getContactEvents', () => {
    it('should fetch contact event history when there is only one event', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      const contactEventsResponse = [
        {
          legacySubjectId,
          type: 'contact',
          dateTime: '2003-03-03T03:03:03',
          details: {
            contactDateTime: null,
            inboundOrOutbound: null,
            fromTo: null,
            channel: null,
            subjectConsentWithdrawn: null,
            callOutcome: null,
            statement: null,
            reasonForContact: null,
            outcomeOfContact: null,
            visitRequired: null,
            visitId: null,
          },
        } as AlcoholMonitoringContactEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/alcohol-monitoring/${legacySubjectId}/contact-events`,
        contactEventsResponse,
      )

      const result = await datastoreApiClient.getContactEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(contactEventsResponse)
    })

    it('should fetch contact event history when there are more than one event', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      const contactEventsResponse = [
        {
          legacySubjectId,
          type: 'contact',
          dateTime: '2003-03-03T03:03:03',
          details: {
            contactDateTime: null,
            inboundOrOutbound: null,
            fromTo: null,
            channel: null,
            subjectConsentWithdrawn: null,
            callOutcome: null,
            statement: null,
            reasonForContact: null,
            outcomeOfContact: null,
            visitRequired: null,
            visitId: null,
          },
        } as AlcoholMonitoringContactEvent,
        {
          legacySubjectId,
          type: 'contact',
          dateTime: '2003-03-03T03:03:03',
          details: {
            contactDateTime: null,
            inboundOrOutbound: null,
            fromTo: null,
            channel: null,
            subjectConsentWithdrawn: null,
            callOutcome: null,
            statement: null,
            reasonForContact: null,
            outcomeOfContact: null,
            visitRequired: null,
            visitId: null,
          },
        } as AlcoholMonitoringContactEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/alcohol-monitoring/${legacySubjectId}/contact-events`,
        contactEventsResponse,
      )

      const result = await datastoreApiClient.getContactEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(contactEventsResponse)
    })

    it('should fetch contact event history when there are no events', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`, [])

      const result = await datastoreApiClient.getContactEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual([])
    })

    it('should return unauthorized error when fetching contact event history without proper auth', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedAuthErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`)

      await expect(datastoreApiClient.getContactEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should return internal server error when fetching contact event history when server fails', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedServerErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/contact-events`)

      await expect(datastoreApiClient.getContactEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('getViolationEvents', () => {
    it('should fetch violation event history when there is only one event', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      const violationEventsResponse = [
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementId: null,
            nonComplianceReason: null,
            nonComplianceDateTime: null,
            violationAlertId: null,
            violationAlertDescription: null,
            violationEventNotificationDateTime: null,
            actionTakenEms: null,
            nonComplianceOutcome: null,
            nonComplianceResolved: null,
            dateResolved: null,
            openClosed: null,
            visitRequired: null,
          },
        } as AlcoholMonitoringViolationEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/alcohol-monitoring/${legacySubjectId}/violation-events`,
        violationEventsResponse,
      )

      const result = await datastoreApiClient.getViolationEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(violationEventsResponse)
    })

    it('should fetch violation event history when there are more than one event', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      const violationEventsResponse = [
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementId: null,
            nonComplianceReason: null,
            nonComplianceDateTime: null,
            violationAlertId: null,
            violationAlertDescription: null,
            violationEventNotificationDateTime: null,
            actionTakenEms: null,
            nonComplianceOutcome: null,
            nonComplianceResolved: null,
            dateResolved: null,
            openClosed: null,
            visitRequired: null,
          },
        } as AlcoholMonitoringViolationEvent,
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementId: null,
            nonComplianceReason: null,
            nonComplianceDateTime: null,
            violationAlertId: null,
            violationAlertDescription: null,
            violationEventNotificationDateTime: null,
            actionTakenEms: null,
            nonComplianceOutcome: null,
            nonComplianceResolved: null,
            dateResolved: null,
            openClosed: null,
            visitRequired: null,
          },
        } as AlcoholMonitoringViolationEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/alcohol-monitoring/${legacySubjectId}/violation-events`,
        violationEventsResponse,
      )

      const result = await datastoreApiClient.getViolationEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(violationEventsResponse)
    })

    it('should fetch violation event history when there are no events', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`, [])

      const result = await datastoreApiClient.getViolationEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual([])
    })

    it('should return unauthorized error when fetching violation event history without proper auth', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedAuthErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`)

      await expect(datastoreApiClient.getViolationEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should return internal server error when fetching violation event history when server fails', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedServerErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/violation-events`)

      await expect(datastoreApiClient.getViolationEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('getOrderDetails', () => {
    const legacySubjectId = '123'

    it('should fetch order summary', async () => {
      const expectedResult = {
        legacySubjectId: '123',
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        sex: null,
        specialInstructions: null,
        phoneNumber: null,
        address1: null,
        address2: null,
        address3: null,
        postcode: null,
        orderStartDate: null,
        orderEndDate: null,
        enforceableCondition: null,
        orderType: null,
        orderTypeDescription: null,
        orderEndOutcome: null,
        responsibleOrganisationPhoneNumber: null,
        responsibleOrganisationEmail: null,
        tagAtSource: null,
      } as AlcoholMonitoringOrderDetails

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}`, expectedResult)

      const result = await datastoreApiClient.getOrderDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch empty order summary', async () => {
      const expectedResult = {
        legacySubjectId: '123',
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        sex: null,
        specialInstructions: null,
        phoneNumber: null,
        address1: null,
        address2: null,
        address3: null,
        postcode: null,
        orderStartDate: null,
        orderEndDate: null,
        enforceableCondition: null,
        orderType: null,
        orderTypeDescription: null,
        orderEndOutcome: null,
        responsibleOrganisationPhoneNumber: null,
        responsibleOrganisationEmail: null,
        tagAtSource: null,
      } as AlcoholMonitoringOrderDetails

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}`, expectedResult)

      const result = await datastoreApiClient.getOrderDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      mockServer.withMockedAuthErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}`)

      await expect(datastoreApiClient.getOrderDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      mockServer.withMockedServerErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}`)

      await expect(datastoreApiClient.getOrderDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('listOrderDetailsByQueryExecutionId', () => {
    it('submits a request containing a query execution ID and returns search results', async () => {
      const queryExecutionId = 'query-execution-id'

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring?id=${queryExecutionId}`, [])

      const result = await datastoreApiClient.listOrderDetailsByQueryExecutionId(queryExecutionId, 'test-system-token')
      expect(result).toEqual([])
    })

    describe('error handling', () => {
      it('handles invalid query execution ID errors from the datastore client', async () => {
        mockServer.withMockedServerErrorGetResponse(`/orders/alcohol-monitoring?id=`, {
          status: 500,
          userMessage: '',
          developerMessage: 'QueryExecution ABC was not found (Service: Athena, Status Code: 400, Request ID: ABC',
        })

        await expect(datastoreApiClient.listOrderDetailsByQueryExecutionId('', 'test-system-token')).rejects.toThrow(
          'Internal Server Error',
        ) // 'Invalid query execution ID')
      })

      it('handles other errors from the datastore client', async () => {
        mockServer.withMockedServerErrorGetResponse(`/orders/alcohol-monitoring?id=`, {
          status: 500,
          errorCode: null,
          userMessage:
            "Unexpected error: The Amazon Athena query failed to run with error message: TABLE_NOT_FOUND: line 1:111: Table 'xxx.yyy.zzz' does not exist",
          developerMessage:
            "The Amazon Athena query failed to run with error message: TABLE_NOT_FOUND: line 1:111: Table 'xxx.yyy.zzz' does not exist",
          moreInfo: null,
        })

        await expect(datastoreApiClient.listOrderDetailsByQueryExecutionId('', 'test-system-token')).rejects.toThrow(
          'Internal Server Error',
        )
      })
    })
  })

  describe('getServiceDetails', () => {
    const legacySubjectId = '123'

    it('should fetch a list of one service detail item', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceStartDate: null,
          serviceEndDate: null,
          serviceAddress: null,
          equipmentStartDate: null,
          equipmentEndDate: null,
          hmuSerialNumber: null,
          deviceSerialNumber: null,
        } as AlcoholMonitoringServiceDetails,
      ]

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`, expectedResult)

      const result = await datastoreApiClient.getServiceDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple service detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceStartDate: null,
          serviceEndDate: null,
          serviceAddress: null,
          equipmentStartDate: null,
          equipmentEndDate: null,
          hmuSerialNumber: null,
          deviceSerialNumber: null,
        } as AlcoholMonitoringServiceDetails,
        {
          legacySubjectId: '456',
          serviceStartDate: null,
          serviceEndDate: null,
          serviceAddress: null,
          equipmentStartDate: null,
          equipmentEndDate: null,
          hmuSerialNumber: null,
          deviceSerialNumber: null,
        } as AlcoholMonitoringServiceDetails,
        {
          legacySubjectId: '789',
          serviceStartDate: null,
          serviceEndDate: null,
          serviceAddress: null,
          equipmentStartDate: null,
          equipmentEndDate: null,
          hmuSerialNumber: null,
          deviceSerialNumber: null,
        } as AlcoholMonitoringServiceDetails,
      ]

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`, expectedResult)

      const result = await datastoreApiClient.getServiceDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of service detail items', async () => {
      const expectedResult = [] as AlcoholMonitoringServiceDetails[]

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`, expectedResult)

      const result = await datastoreApiClient.getServiceDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      mockServer.withMockedAuthErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`)

      await expect(datastoreApiClient.getServiceDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      mockServer.withMockedServerErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/service-details`)

      await expect(datastoreApiClient.getServiceDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('getVisitDetails', () => {
    const legacySubjectId = '123'

    it('should fetch list of visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
      ]

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`, expectedResult)

      const result = await datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details even if not visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
      ]

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`, expectedResult)

      const result = await datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
        {
          legacySubjectId: '456',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
        {
          legacySubjectId: '789',
          visitId: null,
          visitType: null,
          visitAttempt: null,
          dateVisitRaised: null,
          visitAddress: null,
          visitNotes: null,
          visitOutcome: null,
          actualWorkStartDateTime: null,
          actualWorkEndDateTime: null,
          visitRejectionReason: null,
          visitRejectionDescription: null,
          visitCancelReason: null,
          visitCancelDescription: null,
        } as AlcoholMonitoringVisitDetails,
      ]

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`, expectedResult)

      const result = await datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details', async () => {
      const expectedResult = [] as AlcoholMonitoringVisitDetails[]

      mockServer.withMockedGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`, expectedResult)

      const result = await datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      mockServer.withMockedAuthErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`)

      await expect(datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      mockServer.withMockedServerErrorGetResponse(`/orders/alcohol-monitoring/${legacySubjectId}/visit-details`)

      await expect(datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })
})
