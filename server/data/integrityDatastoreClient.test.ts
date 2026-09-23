import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import IntegrityDatastoreClient from './integrityDatastoreClient'
import { MockServer } from '../testutils/mockServer'
import config from '../config'

import { IntegrityEquipmentDetails } from './models/integrityEquipmentDetails'
import { IntegrityIncidentEvent } from './models/integrityIncidentEvent'
import { IntegrityContactEvent } from './models/integrityContactEvent'
import { IntegrityViolationEvent } from './models/integrityViolationEvent'
import { IntegrityMonitoringEvent } from './models/integrityMonitoringEvent'
import { IntegrityOrderDetails } from './models/integrityOrderDetails'
import { IntegrityServiceDetails } from './models/integrityServiceDetails'
import { IntegrityVisitDetails } from './models/integrityVisitDetails'
import { IntegritySuspensionOfVisits } from './models/integritySuspensionOfVisits'

const mockServer = new MockServer(config.apis.integrityDatastoreApi.url)

describe('Integrity Datastore Client', () => {
  let datastoreApiClient: IntegrityDatastoreClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('unused-test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    datastoreApiClient = new IntegrityDatastoreClient(mockAuthenticationClient)
  })

  afterEach(() => {
    mockServer.clearMocks()
    jest.resetAllMocks()
  })

  describe('runSearchQuery', () => {
    it('posts an integrity search query and returns an order execution ID', async () => {
      const expectedResponse = { queryExecutionId: 'abcd' }
      mockServer.withMockedPostResponse(
        `/orders/integrity?restricted=false`,
        {
          legacySubjectId: '',
          firstName: 'John',
          lastName: 'Doe',
          alias: 'JD',
          dateOfBirth: '2021-02-10',
        },
        expectedResponse,
      )

      const result = await datastoreApiClient.runSearchQuery(
        'integrity',
        {
          legacySubjectId: '',
          firstName: 'John',
          lastName: 'Doe',
          alias: 'JD',
          dateOfBirth: '2021-02-10',
        },
        'test-system-token',
        false,
      )
      expect(result).toEqual(expectedResponse)
    })

    it.skip('handles auth errors from the datastore client', async () => {
      mockServer.withMockedAuthErrorPostResponse(`/orders/integrity`, {
        legacySubjectId: '',
        firstName: 'John',
        lastName: 'Doe',
        alias: 'JD',
        dateOfBirth: '2021-02-10',
      })

      expect(
        datastoreApiClient.runSearchQuery(
          'integrity',
          {
            legacySubjectId: '',
            firstName: 'John',
            lastName: 'Doe',
            alias: 'JD',
            dateOfBirth: '2021-02-10',
          },
          'test-system-token',
        ),
      ).rejects.toThrow('Error submitting search query')
    })

    it.skip('handles errors from the datastore client', async () => {
      mockServer.withMockedServerErrorPostResponse('/orders/integrity', {
        legacySubjectId: '',
        firstName: 'John',
        lastName: 'Doe',
        alias: 'JD',
        dateOfBirth: '2021-02-10',
      })

      expect(
        datastoreApiClient.runSearchQuery(
          'integrity',
          {
            legacySubjectId: '',
            firstName: 'John',
            lastName: 'Doe',
            alias: 'JD',
            dateOfBirth: '2021-02-10',
          },
          'test-system-token',
        ),
      ).rejects.toThrow('Error submitting search query')
    })
  })

  describe('getEquipmentDetails', () => {
    const legacySubjectId = '123'

    it('should fetch list of equipment details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123',
          deviceType: '',
          deviceSerialNumber: '',
          deviceAddressType: '',
          legFitting: '',
          deviceInstalledDateTime: '',
          deviceRemovedDateTime: '',
          hmuInstallDateTime: '',
          hmuRemovedDateTime: '',
        } as IntegrityEquipmentDetails,
      ]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/equipment-details?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getEquipmentDetails(legacySubjectId, 'test-system-token')

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          deviceType: '',
          deviceSerialNumber: '',
          deviceAddressType: '',
          legFitting: '',
          deviceInstalledDateTime: '',
          deviceRemovedDateTime: '',
          hmuInstallDateTime: '',
          hmuRemovedDateTime: '',
        } as IntegrityEquipmentDetails,
        {
          legacySubjectId: '456',
          deviceType: '',
          deviceSerialNumber: '',
          deviceAddressType: '',
          legFitting: '',
          deviceInstalledDateTime: '',
          deviceRemovedDateTime: '',
          hmuInstallDateTime: '',
          hmuRemovedDateTime: '',
        } as IntegrityEquipmentDetails,
        {
          legacySubjectId: '789',
          deviceType: '',
          deviceSerialNumber: '',
          deviceAddressType: '',
          legFitting: '',
          deviceInstalledDateTime: '',
          deviceRemovedDateTime: '',
          hmuInstallDateTime: '',
          hmuRemovedDateTime: '',
        } as IntegrityEquipmentDetails,
      ]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/equipment-details?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getEquipmentDetails(legacySubjectId, 'test-system-token')

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of equipment details', async () => {
      const expectedResult = [] as IntegrityEquipmentDetails[]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/equipment-details?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getEquipmentDetails(legacySubjectId, 'test-system-token')

      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      mockServer.withMockedAuthErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/equipment-details?restricted=false`,
      )

      await expect(datastoreApiClient.getEquipmentDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      mockServer.withMockedServerErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/equipment-details?restricted=false`,
      )

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
            violationAlertId: '',
            violationAlertDateTime: '',
            violationAlertType: '',
            violationAlertResponseAction: '',
            visitRequired: '',
            probationInteractionRequired: '',
            amsInteractionRequired: '',
            multipleAlerts: '',
            additionalAlerts: '',
          },
        } as IntegrityIncidentEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/incident-events?restricted=false`,
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
            violationAlertId: '',
            violationAlertDateTime: '',
            violationAlertType: '',
            violationAlertResponseAction: '',
            visitRequired: '',
            probationInteractionRequired: '',
            amsInteractionRequired: '',
            multipleAlerts: '',
            additionalAlerts: '',
          },
        } as IntegrityIncidentEvent,
        {
          legacySubjectId,
          type: 'incident',
          dateTime: '2003-03-03T03:03:03',
          details: {
            violationAlertId: '',
            violationAlertDateTime: '',
            violationAlertType: '',
            violationAlertResponseAction: '',
            visitRequired: '',
            probationInteractionRequired: '',
            amsInteractionRequired: '',
            multipleAlerts: '',
            additionalAlerts: '',
          },
        } as IntegrityIncidentEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/incident-events?restricted=false`,
        incidentEventsResponse,
      )

      const result = await datastoreApiClient.getIncidentEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(incidentEventsResponse)
    })

    it('should fetch incident event history when there are no events', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedGetResponse(`/orders/integrity/${legacySubjectId}/incident-events?restricted=false`, [])

      const result = await datastoreApiClient.getIncidentEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual([])
    })

    it('should return unauthorized error when fetching incident event history without proper auth', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedAuthErrorGetResponse(`/orders/integrity/${legacySubjectId}/incident-events?restricted=false`)

      await expect(datastoreApiClient.getIncidentEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should return internal server error when fetching incident event history when server fails', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedServerErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/incident-events?restricted=false`,
      )

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
            contactDateTime: '',
            inboundOrOutbound: '',
            fromTo: '',
            channel: '',
            subjectConsentWithdrawn: '',
            callOutcome: '',
            statement: '',
            reasonForContact: '',
            outcomeOfContact: '',
            visitRequired: '',
            visitId: '',
          },
        } as IntegrityContactEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/contact-events?restricted=false`,
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
            contactDateTime: '',
            inboundOrOutbound: '',
            fromTo: '',
            channel: '',
            subjectConsentWithdrawn: '',
            callOutcome: '',
            statement: '',
            reasonForContact: '',
            outcomeOfContact: '',
            visitRequired: '',
            visitId: '',
          },
        } as IntegrityContactEvent,
        {
          legacySubjectId,
          type: 'contact',
          dateTime: '2003-03-03T03:03:03',
          details: {
            contactDateTime: '',
            inboundOrOutbound: '',
            fromTo: '',
            channel: '',
            subjectConsentWithdrawn: '',
            callOutcome: '',
            statement: '',
            reasonForContact: '',
            outcomeOfContact: '',
            visitRequired: '',
            visitId: '',
          },
        } as IntegrityContactEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/contact-events?restricted=false`,
        contactEventsResponse,
      )

      const result = await datastoreApiClient.getContactEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(contactEventsResponse)
    })

    it('should fetch contact event history when there are no events', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedGetResponse(`/orders/integrity/${legacySubjectId}/contact-events?restricted=false`, [])

      const result = await datastoreApiClient.getContactEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual([])
    })

    it('should return unauthorized error when fetching contact event history without proper auth', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedAuthErrorGetResponse(`/orders/integrity/${legacySubjectId}/contact-events?restricted=false`)

      await expect(datastoreApiClient.getContactEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should return internal server error when fetching contact event history when server fails', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedServerErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/contact-events?restricted=false`,
      )

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
            enforcementId: '',
            nonComplianceReason: '',
            nonComplianceDateTime: '',
            violationAlertId: '',
            violationAlertDescription: '',
            violationEventNotificationDateTime: '',
            actionTakenEms: '',
            nonComplianceOutcome: '',
            nonComplianceResolved: '',
            dateResolved: '',
            openClosed: '',
            visitRequired: '',
          },
        } as IntegrityViolationEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/violation-events?restricted=false`,
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
            enforcementId: '',
            nonComplianceReason: '',
            nonComplianceDateTime: '',
            violationAlertId: '',
            violationAlertDescription: '',
            violationEventNotificationDateTime: '',
            actionTakenEms: '',
            nonComplianceOutcome: '',
            nonComplianceResolved: '',
            dateResolved: '',
            openClosed: '',
            visitRequired: '',
          },
        } as IntegrityViolationEvent,
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementId: '',
            nonComplianceReason: '',
            nonComplianceDateTime: '',
            violationAlertId: '',
            violationAlertDescription: '',
            violationEventNotificationDateTime: '',
            actionTakenEms: '',
            nonComplianceOutcome: '',
            nonComplianceResolved: '',
            dateResolved: '',
            openClosed: '',
            visitRequired: '',
          },
        } as IntegrityViolationEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/violation-events?restricted=false`,
        violationEventsResponse,
      )

      const result = await datastoreApiClient.getViolationEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(violationEventsResponse)
    })

    it('should fetch violation event history when there are no events', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedGetResponse(`/orders/integrity/${legacySubjectId}/violation-events?restricted=false`, [])

      const result = await datastoreApiClient.getViolationEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual([])
    })

    it('should return unauthorized error when fetching violation event history without proper auth', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedAuthErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/violation-events?restricted=false`,
      )

      await expect(datastoreApiClient.getViolationEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should return internal server error when fetching violation event history when server fails', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedServerErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/violation-events?restricted=false`,
      )

      await expect(datastoreApiClient.getViolationEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('getMonitoringEvents', () => {
    it('should fetch monitoring event history when there is only one event', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      const monitoringEventsResponse = [
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementId: '',
            nonComplianceReason: '',
            nonComplianceDateTime: '',
            violationAlertId: '',
            violationAlertDescription: '',
            violationEventNotificationDateTime: '',
            actionTakenEms: '',
            nonComplianceOutcome: '',
            nonComplianceResolved: '',
            dateResolved: '',
            openClosed: '',
            visitRequired: '',
          },
        } as IntegrityMonitoringEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/monitoring-events?restricted=false`,
        monitoringEventsResponse,
      )

      const result = await datastoreApiClient.getMonitoringEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(monitoringEventsResponse)
    })

    it('should fetch monitoring event history when there are more than one event', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      const monitoringEventsResponse = [
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementId: '',
            nonComplianceReason: '',
            nonComplianceDateTime: '',
            violationAlertId: '',
            violationAlertDescription: '',
            violationEventNotificationDateTime: '',
            actionTakenEms: '',
            nonComplianceOutcome: '',
            nonComplianceResolved: '',
            dateResolved: '',
            openClosed: '',
            visitRequired: '',
          },
        } as IntegrityMonitoringEvent,
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2004-04-04T04:04:04',
          details: {
            enforcementId: '',
            nonComplianceReason: '',
            nonComplianceDateTime: '',
            violationAlertId: '',
            violationAlertDescription: '',
            violationEventNotificationDateTime: '',
            actionTakenEms: '',
            nonComplianceOutcome: '',
            nonComplianceResolved: '',
            dateResolved: '',
            openClosed: '',
            visitRequired: '',
          },
        } as IntegrityMonitoringEvent,
      ]
      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/monitoring-events?restricted=false`,
        monitoringEventsResponse,
      )

      const result = await datastoreApiClient.getMonitoringEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual(monitoringEventsResponse)
    })

    it('should fetch monitoring event history when there are no events', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedGetResponse(`/orders/integrity/${legacySubjectId}/monitoring-events?restricted=false`, [])

      const result = await datastoreApiClient.getMonitoringEvents(legacySubjectId, 'test-system-token')
      expect(result).toEqual([])
    })

    it('should return unauthorized error when fetching monitoring event history without proper auth', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedAuthErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/monitoring-events?restricted=false`,
      )

      await expect(datastoreApiClient.getMonitoringEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should return internal server error when fetching monitoring event history when server fails', async () => {
      const legacySubjectId = Math.random().toString(10).substring(2, 7)

      mockServer.withMockedServerErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/monitoring-events?restricted=false`,
      )

      await expect(datastoreApiClient.getMonitoringEvents(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('getOrderDetails', () => {
    const legacySubjectId = '123'

    it('should fetch order details', async () => {
      const expectedResult = {
        specials: 'no',
        legacySubjectId,
        firstName: '',
        lastName: '',
        alias: '',
        dateOfBirth: '',
        adultOrChild: '',
        sex: '',
        contact: '',
        primaryAddressLine1: '',
        primaryAddressLine2: '',
        primaryAddressLine3: '',
        primaryAddressPostCode: '',
        phoneOrMobileNumber: '',
        ppo: '',
        mappa: '',
        technicalBail: '',
        manualRisk: '',
        offenceRisk: false,
        postCodeRisk: '',
        falseLimbRisk: '',
        migratedRisk: '',
        rangeRisk: '',
        reportRisk: '',
        orderStartDate: '',
        orderEndDate: '',
        orderType: '',
        orderTypeDescription: '',
        orderTypeDetail: '',
        wearingWristPid: '',
        notifyingOrganisationDetailsName: '',
        responsibleOrganisation: '',
        responsibleOrganisationDetailsRegion: '',
      } as IntegrityOrderDetails

      mockServer.withMockedGetResponse(`/orders/integrity/${legacySubjectId}?restricted=false`, expectedResult)

      const result = await datastoreApiClient.getOrderDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch empty order summary', async () => {
      const expectedResult = {
        specials: 'no',
        legacySubjectId,
        firstName: '',
        lastName: '',
        alias: '',
        dateOfBirth: '',
        adultOrChild: '',
        sex: '',
        contact: '',
        primaryAddressLine1: '',
        primaryAddressLine2: '',
        primaryAddressLine3: '',
        primaryAddressPostCode: '',
        phoneOrMobileNumber: '',
        ppo: '',
        mappa: '',
        technicalBail: '',
        manualRisk: '',
        offenceRisk: false,
        postCodeRisk: '',
        falseLimbRisk: '',
        migratedRisk: '',
        rangeRisk: '',
        reportRisk: '',
        orderStartDate: '',
        orderEndDate: '',
        orderType: '',
        orderTypeDescription: '',
        orderTypeDetail: '',
        wearingWristPid: '',
        notifyingOrganisationDetailsName: '',
        responsibleOrganisation: '',
        responsibleOrganisationDetailsRegion: '',
      } as IntegrityOrderDetails

      mockServer.withMockedGetResponse(`/orders/integrity/${legacySubjectId}?restricted=false`, expectedResult)

      const result = await datastoreApiClient.getOrderDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      mockServer.withMockedAuthErrorGetResponse(`/orders/integrity/${legacySubjectId}?restricted=false`)

      await expect(datastoreApiClient.getOrderDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      mockServer.withMockedServerErrorGetResponse(`/orders/integrity/${legacySubjectId}?restricted=false`)

      await expect(datastoreApiClient.getOrderDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('listOrderDetailsByQueryExecutionId', () => {
    it('submits a request containing a query execution ID and returns search results', async () => {
      const queryExecutionId = 'query-execution-id'

      mockServer.withMockedGetResponse(`/orders/integrity?id=${queryExecutionId}&restricted=false`, [])

      const result = await datastoreApiClient.listOrderDetailsByQueryExecutionId(queryExecutionId, 'test-system-token')
      expect(result).toEqual([])
    })

    describe('error handling', () => {
      it('handles invalid query execution ID errors from the datastore client', async () => {
        mockServer.withMockedServerErrorGetResponse(`/orders/integrity?id=&restricted=false`, {
          status: 500,
          userMessage: '',
          developerMessage: 'QueryExecution ABC was not found (Service: Athena, Status Code: 400, Request ID: ABC',
        })

        await expect(datastoreApiClient.listOrderDetailsByQueryExecutionId('', 'test-system-token')).rejects.toThrow(
          'Internal Server Error',
        ) // 'Invalid query execution ID')
      })

      it('handles other errors from the datastore client', async () => {
        mockServer.withMockedServerErrorGetResponse(`/orders/integrity?id=&restricted=false`, {
          status: 500,
          errorCode: '',
          userMessage:
            "Unexpected error: The Amazon Athena query failed to run with error message: TABLE_NOT_FOUND: line 1:111: Table 'xxx.yyy.zzz' does not exist",
          developerMessage:
            "The Amazon Athena query failed to run with error message: TABLE_NOT_FOUND: line 1:111: Table 'xxx.yyy.zzz' does not exist",
          moreInfo: '',
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
          serviceId: 321,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostCode: 'postCode',
          serviceStartDate: '2002-05-22T01:01:01',
          serviceEndDate: '2002-05-22T01:01:01',
          curfewStartDate: '2002-05-22T01:01:01',
          curfewEndDate: '2002-05-22T01:01:01',
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
          sunday: 1,
        },
      ] as IntegrityServiceDetails[]

      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/service-details?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getServiceDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch a list of multiple service detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          serviceId: 321,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostCode: 'postCode',
          serviceStartDate: '2002-05-22T01:01:01',
          serviceEndDate: '2002-05-22T01:01:01',
          curfewStartDate: '2002-05-22T01:01:01',
          curfewEndDate: '2002-05-22T01:01:01',
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
          sunday: 1,
        },
        {
          legacySubjectId: '456',
          serviceId: 322,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostCode: 'postCode',
          serviceStartDate: '2002-05-22T01:01:01',
          serviceEndDate: '2002-05-22T01:01:01',
          curfewStartDate: '2002-05-22T01:01:01',
          curfewEndDate: '2002-05-22T01:01:01',
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
          sunday: 1,
        },
        {
          legacySubjectId: '789',
          serviceId: 323,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostCode: 'postCode',
          serviceStartDate: '2002-05-22T01:01:01',
          serviceEndDate: '2002-05-22T01:01:01',
          curfewStartDate: '2002-05-22T01:01:01',
          curfewEndDate: '2002-05-22T01:01:01',
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
          sunday: 1,
        },
      ] as IntegrityServiceDetails[]

      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/service-details?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getServiceDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch an empty list of service detail items', async () => {
      const expectedResult = [] as IntegrityServiceDetails[]

      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/service-details?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getServiceDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      mockServer.withMockedAuthErrorGetResponse(`/orders/integrity/${legacySubjectId}/service-details?restricted=false`)

      await expect(datastoreApiClient.getServiceDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      mockServer.withMockedServerErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/service-details?restricted=false`,
      )

      await expect(datastoreApiClient.getServiceDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('getSuspensionOfVisits', () => {
    const legacySubjectId = '123'

    it('should fetch suspension of visits', async () => {
      const expectedResult = {
        legacySubjectId,
        suspensionOfVisits: 'yes',
        requestedDate: '',
        startDate: '',
        startTime: '',
        endDate: '',
      } as IntegritySuspensionOfVisits

      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/suspension-of-visits?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getSuspensionOfVisits(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch empty order summary', async () => {
      const expectedResult = {
        legacySubjectId,
        suspensionOfVisits: 'yes',
        requestedDate: '',
        startDate: '',
        startTime: '',
        endDate: '',
      } as IntegritySuspensionOfVisits

      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/suspension-of-visits?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getSuspensionOfVisits(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      mockServer.withMockedAuthErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/suspension-of-visits?restricted=false`,
      )

      await expect(datastoreApiClient.getSuspensionOfVisits(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      mockServer.withMockedServerErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/suspension-of-visits?restricted=false`,
      )

      await expect(datastoreApiClient.getSuspensionOfVisits(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })

    it('should propagate an error if there is a server error when fetching suspension of visits', async () => {
      mockServer.withMockedServerErrorGetResponse(
        `/orders/integrity/${legacySubjectId}/suspension-of-visits?restricted=false`,
      )

      await expect(datastoreApiClient.getSuspensionOfVisits(legacySubjectId, 'test-system-token')).rejects.toEqual(
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
          address: '',
          actualWorkStartDateTime: '2020-02-02T00:00:00.000Z',
          actualWorkEndDateTime: '',
          visitNotes: '',
          visitType: '',
          visitOutcome: '',
        },
      ] as IntegrityVisitDetails[]

      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/visit-details?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details even if not visit details', async () => {
      const expectedResult = [
        {
          legacySubjectId: '123A',
          address: '',
          actualWorkStartDateTime: '2020-02-02T00:00:00.000Z',
          actualWorkEndDateTime: '',
          visitNotes: '',
          visitType: '',
          visitOutcome: '',
        },
      ] as IntegrityVisitDetails[]

      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/visit-details?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')

      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of multiple equipment detail items', async () => {
      const expectedResult = [
        {
          legacySubjectId,
          address: '',
          actualWorkStartDateTime: '2020-02-02T00:00:00.000Z',
          actualWorkEndDateTime: '',
          visitNotes: '',
          visitType: '',
          visitOutcome: '',
        },
        {
          legacySubjectId: '456',
          address: '',
          actualWorkStartDateTime: '2020-02-02T00:00:00.000Z',
          actualWorkEndDateTime: '',
          visitNotes: '',
          visitType: '',
          visitOutcome: '',
        },
        {
          legacySubjectId: '789',
          address: '',
          actualWorkStartDateTime: '2020-02-02T00:00:00.000Z',
          actualWorkEndDateTime: '',
          visitNotes: '',
          visitType: '',
          visitOutcome: '',
        },
      ] as IntegrityVisitDetails[]

      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/visit-details?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should fetch list of visit details', async () => {
      const expectedResult = [] as IntegrityVisitDetails[]

      mockServer.withMockedGetResponse(
        `/orders/integrity/${legacySubjectId}/visit-details?restricted=false`,
        expectedResult,
      )

      const result = await datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      mockServer.withMockedAuthErrorGetResponse(`/orders/integrity/${legacySubjectId}/visit-details?restricted=false`)

      await expect(datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Unauthorized'),
      )
    })

    it('should propagate an error if there is a server error', async () => {
      mockServer.withMockedServerErrorGetResponse(`/orders/integrity/${legacySubjectId}/visit-details?restricted=false`)

      await expect(datastoreApiClient.getVisitDetails(legacySubjectId, 'test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })

  describe('testConnection', () => {
    it('should test the connection to the integrity datastore', async () => {
      const expectedResult = {
        foo: 'bar',
      }

      mockServer.withMockedGetResponse(`/test`, expectedResult)

      const result = await datastoreApiClient.testConnection('test-system-token')
      expect(result).toEqual(expectedResult)
    })

    it('should propagate an error if there is an authorization error', async () => {
      mockServer.withMockedAuthErrorGetResponse(`/test`)

      await expect(datastoreApiClient.testConnection('test-system-token')).rejects.toEqual(new Error('Unauthorized'))
    })

    it('should propagate an error if there is a server error', async () => {
      mockServer.withMockedServerErrorGetResponse(`/test`)

      await expect(datastoreApiClient.testConnection('test-system-token')).rejects.toEqual(
        new Error('Internal Server Error'),
      )
    })
  })
})
