import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'

import mockIntegrityApi from '../mockApis/integrityDatastoreApi'

import AppPage from '../pages/appPage'
import IntegrityOrderDetailsPage from '../pages/integrityOrderDetails'
import IntegrityOrderSummaryPage from '../pages/integrityOrderSummary'
import IntegrityEquipmentHistoryPage from '../pages/integrityEquipmentHistory'
import IntegrityServiceHistoryPage from '../pages/integrityServiceHistory'
import IntegrityVisitHistoryPage from '../pages/integrityVisitHistory'
import IntegritySuspensionOfVisitsHistoryPage from '../pages/integritySuspensionOfVisitsHistory'
import IntegrityEventHistoryPage from '../pages/integrityEventHistory'

test.describe('Integrity event history', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('1234', false, [])
      await mockIntegrityApi.stubGetIncidentEvents('1234', false, [])
      await mockIntegrityApi.stubGetContactEvents('1234', false, [])
      await mockIntegrityApi.stubGetViolationEvents('1234', false, [])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(integrityEventHistoryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('2345', false, [])
      await mockIntegrityApi.stubGetIncidentEvents('2345', false, [])
      await mockIntegrityApi.stubGetContactEvents('2345', false, [])
      await mockIntegrityApi.stubGetViolationEvents('2345', false, [])

      await mockIntegrityApi.stubGetEquipmentDetails('2345', false, [
        {
          legacySubjectId: '2345',
        },
      ])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '2345',
      })

      await expect(integrityEventHistoryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('4567', false, [])
      await mockIntegrityApi.stubGetIncidentEvents('4567', false, [])
      await mockIntegrityApi.stubGetContactEvents('4567', false, [])
      await mockIntegrityApi.stubGetViolationEvents('4567', false, [])

      await mockIntegrityApi.stubGetEquipmentDetails('4567', false, [
        {
          legacySubjectId: '4567',
        },
      ])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '4567',
      })

      await expect(integrityEventHistoryPage.serviceInformationBanner).toBeVisible()
      await expect(integrityEventHistoryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the search page', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('5678', false, [])
      await mockIntegrityApi.stubGetIncidentEvents('5678', false, [])
      await mockIntegrityApi.stubGetContactEvents('5678', false, [])
      await mockIntegrityApi.stubGetViolationEvents('5678', false, [])

      await mockIntegrityApi.stubGetEquipmentDetails('5678', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityEventHistoryPage.backLink.click()

      await AppPage.verifyOnPage(IntegrityOrderDetailsPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('1234', false, [])
      await mockIntegrityApi.stubGetIncidentEvents('1234', false, [])
      await mockIntegrityApi.stubGetContactEvents('1234', false, [])
      await mockIntegrityApi.stubGetViolationEvents('1234', false, [])

      await mockIntegrityApi.stubGetEquipmentDetails('1234', false, [
        {
          legacySubjectId: '1234',
        },
      ])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await integrityEventHistoryPage.checkIsAccessible()
    })
  })

  test.describe('Event history timeline with no entries', () => {
    test('Displays a message when no results are found', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('11111111', false, [])
      await mockIntegrityApi.stubGetIncidentEvents('11111111', false, [])
      await mockIntegrityApi.stubGetContactEvents('11111111', false, [])
      await mockIntegrityApi.stubGetViolationEvents('11111111', false, [])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      await expect(integrityEventHistoryPage.eventHistory.element).not.toBeVisible()
      await expect(integrityEventHistoryPage.eventHistory.noResultsHeading).toBeVisible()
      await expect(integrityEventHistoryPage.eventHistory.noResultsMessage).toBeVisible()
    })
  })

  test.describe('Event history timeline with entries', () => {
    test('Displays an event history timeline with one of each event type', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('11111111', false, [
        {
          legacySubjectId: '11111111',
          type: 'monitoring',
          dateTime: '2022-02-02T01:03:03Z',
          details: {
            processedDateTime: '2022-02-02T01:03:03Z',
          },
        },
      ])

      await mockIntegrityApi.stubGetIncidentEvents('11111111', false, [
        {
          legacySubjectId: '11111111',
          type: 'incident',
          dateTime: '2022-02-02T01:06:06Z',
          details: {
            type: 'an incident occurred',
          },
        },
      ])

      await mockIntegrityApi.stubGetContactEvents('11111111', false, [
        {
          legacySubjectId: '11111111',
          type: 'contact',
          dateTime: '2022-02-03T01:09:09Z',
          details: {
            outcome: 'there was an outcome',
            type: 'PHONE_CALL',
            reason: 'there was a reason',
            channel: 'TELEPHONE',
            userId: 'Test User A',
            userName: 'UID-123',
            modifiedDateTime: '2022-02-03T01:09:09Z',
          },
        },
      ])

      await mockIntegrityApi.stubGetViolationEvents('11111111', false, [
        {
          legacySubjectId: '11111111',
          type: 'violation',
          dateTime: '2022-02-03T01:12:12Z',
          details: {
            breachDetails: 'details of breach',
            breachEnforcementOutcome: 'outcome of breach',
            breachDateTime: '2022-02-03T01:12:12Z',
            breachIdentifiedDateTime: '2022-02-03T01:12:12Z',
            breachPackRequestedDate: '2022-02-03T01:12:12Z',
            breachPackSentDate: '2022-02-03T01:12:12Z',

            authorityFirstNotifiedDateTime: '2022-02-03T01:12:12Z',

            agencyAction: 'action of agency',
            agencyResponseDate: '2022-02-03T01:12:12Z',

            investigationOutcomeReason: 'invest outcome',
            enforcementReason: 'enforce reason',

            warningLetterSentDateTime: '2022-02-03T01:12:12Z',
            subjectLetterSentDate: '2022-02-03T01:12:12Z',
            summonsServedDate: '2022-02-03T01:12:12Z',
            hearingDate: '2022-02-03T01:12:12Z',
            section9Date: '2022-02-03T01:12:12Z',
          },
        },
      ])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      await expect(integrityEventHistoryPage.eventHistory.getEntry(1).element).toBeVisible()
      await expect(integrityEventHistoryPage.eventHistory.getEntry(2).element).toBeVisible()
      await expect(integrityEventHistoryPage.eventHistory.getEntry(3).element).toBeVisible()
      await expect(integrityEventHistoryPage.eventHistory.getEntry(4).element).toBeVisible()
    })

    test('Displays an event history timeline with one monitoring event', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('11111111', false, [
        {
          legacySubjectId: '11111111',
          type: 'monitoring',
          dateTime: '2022-02-02T01:03:03Z',
          details: {
            processedDateTime: '2022-02-02T01:03:03Z',
          },
        },
      ])

      await mockIntegrityApi.stubGetIncidentEvents('11111111', false, [])
      await mockIntegrityApi.stubGetContactEvents('11111111', false, [])
      await mockIntegrityApi.stubGetViolationEvents('11111111', false, [])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = integrityEventHistoryPage.eventHistory.getEntry(1)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('monitoring')
      await expect(event.date).toHaveText('2 Feb 2022 at 1:03am')

      const monitoringSummaryCard = event.getDescription('monitoring')
      await expect(monitoringSummaryCard).toHaveItem('Processed date', '2 February 2022')
      await expect(monitoringSummaryCard).toHaveItem('Processed time', '1:03am')
    })

    test('Displays an event history timeline with multiple monitoring events', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('22222222', false, [
        {
          legacySubjectId: '22222222',
          type: 'monitoring',
          dateTime: '2022-02-02T01:03:03Z',
          details: {
            processedDateTime: '2022-02-02T01:03:03Z',
          },
        },
        {
          legacySubjectId: '22222222',
          type: 'monitoring',
          dateTime: '2024-04-04T01:03:03Z',
          details: {
            processedDateTime: '2024-04-04T01:03:03Z',
          },
        },
      ])

      await mockIntegrityApi.stubGetIncidentEvents('22222222', false, [])
      await mockIntegrityApi.stubGetContactEvents('22222222', false, [])
      await mockIntegrityApi.stubGetViolationEvents('22222222', false, [])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '22222222',
      })

      const event = integrityEventHistoryPage.eventHistory.getEntry(2)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('monitoring')
      await expect(event.date).toHaveText('4 Apr 2024 at 2:03am')

      const monitoringSummaryCard = event.getDescription('monitoring')
      await expect(monitoringSummaryCard).toHaveItem('Processed date', '4 April 2024')
      await expect(monitoringSummaryCard).toHaveItem('Processed time', '2:03am')
    })

    test('Displays an event history timeline with one incident event', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('11111111', false, [])

      await mockIntegrityApi.stubGetIncidentEvents('11111111', false, [
        {
          legacySubjectId: '11111111',
          type: 'incident',
          dateTime: '2022-02-02T01:06:06Z',
          details: {
            type: 'an incident occurred',
          },
        },
      ])

      await mockIntegrityApi.stubGetContactEvents('11111111', false, [])
      await mockIntegrityApi.stubGetViolationEvents('11111111', false, [])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = integrityEventHistoryPage.eventHistory.getEntry(1)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('incident')
      await expect(event.date).toHaveText('2 Feb 2022 at 1:06am')

      const incidentSummaryCard = event.getDescription('incident')
      await expect(incidentSummaryCard).toHaveItem('Type', 'an incident occurred')
    })

    test('Displays an event history timeline with multiple incident events', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('33333333', false, [])

      await mockIntegrityApi.stubGetIncidentEvents('33333333', false, [
        {
          legacySubjectId: '33333333',
          type: 'incident',
          dateTime: '2021-01-01T01:06:06Z',
          details: {
            type: 'first incident occurred',
          },
        },
        {
          legacySubjectId: '33333333',
          type: 'incident',
          dateTime: '2024-04-04T01:06:06Z',
          details: {
            type: 'a second incident occurred',
          },
        },
      ])

      await mockIntegrityApi.stubGetContactEvents('33333333', false, [])
      await mockIntegrityApi.stubGetViolationEvents('33333333', false, [])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '33333333',
      })

      const event = integrityEventHistoryPage.eventHistory.getEntry(2)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('incident')
      await expect(event.date).toHaveText('4 Apr 2024 at 2:06am')

      const incidentSummaryCard = event.getDescription('incident')
      await expect(incidentSummaryCard).toHaveItem('Type', 'a second incident occurred')
    })

    test('Displays an event history timeline with one contact event', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('11111111', false, [])
      await mockIntegrityApi.stubGetIncidentEvents('11111111', false, [])

      await mockIntegrityApi.stubGetContactEvents('11111111', false, [
        {
          legacySubjectId: '11111111',
          type: 'contact',
          dateTime: '2022-02-03T01:09:09Z',
          details: {
            outcome: 'there was an outcome',
            type: 'PHONE_CALL',
            reason: 'there was a reason',
            channel: 'TELEPHONE',
            userId: 'Test User A',
            userName: 'UID-123',
            modifiedDateTime: '2022-02-03T01:09:09Z',
          },
        },
      ])

      await mockIntegrityApi.stubGetViolationEvents('11111111', false, [])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = integrityEventHistoryPage.eventHistory.getEntry(1)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('contact')
      await expect(event.date).toHaveText('3 Feb 2022 at 1:09am')

      const contactSummaryCard = event.getDescription('PHONE_CALL')
      await expect(contactSummaryCard).toHaveItem('Contact channel', 'TELEPHONE')
      await expect(contactSummaryCard).toHaveItem('Outcome', 'there was an outcome')
      await expect(contactSummaryCard).toHaveItem('Reason', 'there was a reason')
      await expect(contactSummaryCard).toHaveItem('User', 'UID-123')
      await expect(contactSummaryCard).toHaveItem('Modified date', '3 February 2022')
      await expect(contactSummaryCard).toHaveItem('Modified time', '1:09am')
    })

    test('Displays an event history timeline with multiple contact events', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('11111111', false, [])
      await mockIntegrityApi.stubGetIncidentEvents('11111111', false, [])

      await mockIntegrityApi.stubGetContactEvents('11111111', false, [
        {
          legacySubjectId: '11111111',
          type: 'contact',
          dateTime: '2022-02-03T01:09:09Z',
          details: {
            outcome: 'there was an outcome',
            type: 'PHONE_CALL',
            reason: 'there was a reason',
            channel: 'TELEPHONE',
            userId: 'Test User A',
            userName: 'UID-123',
            modifiedDateTime: '2022-02-03T01:09:09Z',
          },
        },
        {
          legacySubjectId: '11111111',
          type: 'contact',
          dateTime: '2026-04-04T01:09:09Z',
          details: {
            outcome: 'there was an outcome',
            type: 'VOICE_MAIL',
            reason: 'there was a reason',
            channel: 'TELEPHONE',
            userId: 'Test User A',
            userName: 'UID-123',
            modifiedDateTime: '2026-04-04T01:09:09Z',
          },
        },
      ])

      await mockIntegrityApi.stubGetViolationEvents('11111111', false, [])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = integrityEventHistoryPage.eventHistory.getEntry(2)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('contact')
      await expect(event.date).toHaveText('4 Apr 2026 at 2:09am')

      const contactSummaryCard = event.getDescription('VOICE_MAIL')
      await expect(contactSummaryCard).toHaveItem('Contact channel', 'TELEPHONE')
      await expect(contactSummaryCard).toHaveItem('Outcome', 'there was an outcome')
      await expect(contactSummaryCard).toHaveItem('Reason', 'there was a reason')
      await expect(contactSummaryCard).toHaveItem('User', 'UID-123')
      await expect(contactSummaryCard).toHaveItem('Modified date', '4 April 2026')
      await expect(contactSummaryCard).toHaveItem('Modified time', '2:09am')
    })

    test('Displays an event history timeline with one violation event', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('11111111', false, [])
      await mockIntegrityApi.stubGetIncidentEvents('11111111', false, [])
      await mockIntegrityApi.stubGetContactEvents('11111111', false, [])

      await mockIntegrityApi.stubGetViolationEvents('11111111', false, [
        {
          legacySubjectId: '11111111',
          type: 'violation',
          dateTime: '2022-02-03T01:12:12Z',
          details: {
            breachDetails: 'details of breach',
            breachEnforcementOutcome: 'outcome of breach',
            breachDateTime: '2022-02-03T01:12:12Z',
            breachIdentifiedDateTime: '2022-02-03T01:12:12Z',
            breachPackRequestedDate: '2022-02-03T01:12:12Z',
            breachPackSentDate: '2022-02-03T01:12:12Z',

            authorityFirstNotifiedDateTime: '2022-02-03T01:12:12Z',

            agencyAction: 'action of agency',
            agencyResponseDate: '2022-02-03T01:12:12Z',

            investigationOutcomeReason: 'invest outcome',
            enforcementReason: 'enforce reason',

            warningLetterSentDateTime: '2022-02-03T01:12:12Z',
            subjectLetterSentDate: '2022-02-03T01:12:12Z',
            summonsServedDate: '2022-02-03T01:12:12Z',
            hearingDate: '2022-02-03T01:12:12Z',
            section9Date: '2022-02-03T01:12:12Z',
          },
        },
      ])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = integrityEventHistoryPage.eventHistory.getEntry(1)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('violation')
      await expect(event.date).toHaveText('3 Feb 2022 at 1:12am')

      const violationSummaryCard = event.getDescription('violation')
      await expect(violationSummaryCard).toHaveItem('Breach enforcement outcome', 'outcome of breach')
      await expect(violationSummaryCard).toHaveItem('Breach date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Breach time', '1:12am')
      await expect(violationSummaryCard).toHaveItem('Breach identified date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Breach identified time', '1:12am')
      await expect(violationSummaryCard).toHaveItem('Breach pack requested date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Breach pack sent date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Authority first notified date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Authority first notified time', '1:12am')
      await expect(violationSummaryCard).toHaveItem('Agency action', 'action of agency')
      await expect(violationSummaryCard).toHaveItem('Agency action date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Investigation outcome reason', 'invest outcome')
      await expect(violationSummaryCard).toHaveItem('Enforcement reason', 'enforce reason')
      await expect(violationSummaryCard).toHaveItem('Warning letter sent date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Warning letter sent time', '1:12am')
      await expect(violationSummaryCard).toHaveItem('Subject letter sent date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Summons server date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Hearing date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Section 9 date', '3 February 2022')
    })

    test('Displays an event history timeline with multiple violation events', async ({ page }) => {
      await mockIntegrityApi.stubGetMonitoringEvents('11111111', false, [])
      await mockIntegrityApi.stubGetIncidentEvents('11111111', false, [])
      await mockIntegrityApi.stubGetContactEvents('11111111', false, [])

      await mockIntegrityApi.stubGetViolationEvents('11111111', false, [
        {
          legacySubjectId: '11111111',
          type: 'violation',
          dateTime: '2021-01-01T01:12:12Z',
          details: {
            breachDetails: 'ignored breach',
          },
        },
        {
          legacySubjectId: '11111111',
          type: 'violation',
          dateTime: '2022-02-03T01:12:12Z',
          details: {
            breachDetails: 'details of breach',
            breachEnforcementOutcome: 'outcome of breach',
            breachDateTime: '2022-02-03T01:12:12Z',
            breachIdentifiedDateTime: '2022-02-03T01:12:12Z',
            breachPackRequestedDate: '2022-02-03T01:12:12Z',
            breachPackSentDate: '2022-02-03T01:12:12Z',

            authorityFirstNotifiedDateTime: '2022-02-03T01:12:12Z',

            agencyAction: 'action of agency',
            agencyResponseDate: '2022-02-03T01:12:12Z',

            investigationOutcomeReason: 'invest outcome',
            enforcementReason: 'enforce reason',

            warningLetterSentDateTime: '2022-02-03T01:12:12Z',
            subjectLetterSentDate: '2022-02-03T01:12:12Z',
            summonsServedDate: '2022-02-03T01:12:12Z',
            hearingDate: '2022-02-03T01:12:12Z',
            section9Date: '2022-02-03T01:12:12Z',
          },
        },
      ])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = integrityEventHistoryPage.eventHistory.getEntry(2)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('violation')
      await expect(event.date).toHaveText('3 Feb 2022 at 1:12am')

      const violationSummaryCard = event.getDescription('violation')
      await expect(violationSummaryCard).toHaveItem('Breach enforcement outcome', 'outcome of breach')
      await expect(violationSummaryCard).toHaveItem('Breach date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Breach time', '1:12am')
      await expect(violationSummaryCard).toHaveItem('Breach identified date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Breach identified time', '1:12am')
      await expect(violationSummaryCard).toHaveItem('Breach pack requested date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Breach pack sent date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Authority first notified date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Authority first notified time', '1:12am')
      await expect(violationSummaryCard).toHaveItem('Agency action', 'action of agency')
      await expect(violationSummaryCard).toHaveItem('Agency action date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Investigation outcome reason', 'invest outcome')
      await expect(violationSummaryCard).toHaveItem('Enforcement reason', 'enforce reason')
      await expect(violationSummaryCard).toHaveItem('Warning letter sent date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Warning letter sent time', '1:12am')
      await expect(violationSummaryCard).toHaveItem('Subject letter sent date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Summons server date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Hearing date', '3 February 2022')
      await expect(violationSummaryCard).toHaveItem('Section 9 date', '3 February 2022')
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test.beforeEach(async () => {
      await mockIntegrityApi.stubGetMonitoringEvents('09876', false, [
        {
          legacySubjectId: '09876',
          type: 'monitoring',
          dateTime: '2022-02-02T01:03:03Z',
          details: {
            processedDateTime: '2022-02-02T01:03:03Z',
          },
        },
      ])

      await mockIntegrityApi.stubGetIncidentEvents('09876', false, [])
      await mockIntegrityApi.stubGetContactEvents('09876', false, [])
      await mockIntegrityApi.stubGetViolationEvents('09876', false, [])
    })

    test('Navigates to the order summary page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('09876', false, {
        specials: 'no',
        legacySubjectId: '09876',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityEventHistoryPage.subNavigationLink('Summary').click()

      await AppPage.verifyOnPage(IntegrityOrderSummaryPage, page)
    })

    test('Navigates to the order details page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('09876', false, {
        specials: 'no',
        legacySubjectId: '09876',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityEventHistoryPage.subNavigationLink('Details').click()

      await AppPage.verifyOnPage(IntegrityOrderDetailsPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('09876', false, [
        {
          legacySubjectId: '09876',
        },
      ])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityEventHistoryPage.subNavigationLink('Equipment').click()

      await AppPage.verifyOnPage(IntegrityEquipmentHistoryPage, page)
    })

    test('Navigates to the service details page', async ({ page }) => {
      await mockIntegrityApi.stubGetServiceDetails('09876', false, [
        {
          legacySubjectId: '09876',
          serviceId: 1111,
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
          sunday: 1,
        },
      ])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityEventHistoryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(IntegrityServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('09876', false, [
        {
          legacySubjectId: '09876',
          actualWorkStartDateTime: '2024-06-01T09:00:00Z',
        },
      ])

      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityEventHistoryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(IntegrityVisitHistoryPage, page)
    })

    test('Navigates to the suspension of visits page', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('09876', false, [
        {
          legacySubjectId: '09876',
        },
      ])
      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityEventHistoryPage.subNavigationLink('Suspension of visits').click()

      await AppPage.verifyOnPage(IntegritySuspensionOfVisitsHistoryPage, page)
    })

    test('Navigates to the event history page', async ({ page }) => {
      const integrityEventHistoryPage = await AppPage.visit(IntegrityEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityEventHistoryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(IntegrityEventHistoryPage, page)
    })
  })
})
