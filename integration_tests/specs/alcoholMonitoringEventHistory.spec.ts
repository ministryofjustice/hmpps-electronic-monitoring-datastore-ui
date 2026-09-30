import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'

import mockAlcoholMonitoringApi from '../mockApis/alcoholMonitoringDatastoreApi'

import AppPage from '../pages/appPage'
import AlcoholMonitoringOrderDetailsPage from '../pages/alcoholMonitoringOrderDetails'
import AlcoholMonitoringOrderSummaryPage from '../pages/alcoholMonitoringOrderSummary'
import AlcoholMonitoringEquipmentHistoryPage from '../pages/alcoholMonitoringEquipmentHistory'
import AlcoholMonitoringServiceHistoryPage from '../pages/alcoholMonitoringServiceHistory'
import AlcoholMonitoringVisitHistoryPage from '../pages/alcoholMonitoringVisitHistory'
import AlcoholMonitoringEventHistoryPage from '../pages/alcoholMonitoringEventHistory'

test.describe('AlcoholMonitoring event history', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('1234', [
        {
          legacySubjectId: '09876',
          type: 'incident',
          dateTime: '2022-02-02T01:03:03Z',
          details: {
            violationAlertId: 'V001',
          },
        },
      ])
      await mockAlcoholMonitoringApi.stubGetContactEvents('1234', [])
      await mockAlcoholMonitoringApi.stubGetViolationEvents('1234', [])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(alcoholMonitoringEventHistoryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('2345', [
        {
          legacySubjectId: '09876',
          type: 'incident',
          dateTime: '2022-02-02T01:03:03Z',
          details: {
            violationAlertId: 'V001',
          },
        },
      ])
      await mockAlcoholMonitoringApi.stubGetContactEvents('2345', [])
      await mockAlcoholMonitoringApi.stubGetViolationEvents('2345', [])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '2345',
      })

      await expect(alcoholMonitoringEventHistoryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('4567', [
        {
          legacySubjectId: '09876',
          type: 'incident',
          dateTime: '2022-02-02T01:03:03Z',
          details: {
            violationAlertId: 'V001',
          },
        },
      ])
      await mockAlcoholMonitoringApi.stubGetContactEvents('4567', [])
      await mockAlcoholMonitoringApi.stubGetViolationEvents('4567', [])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '4567',
      })

      await expect(alcoholMonitoringEventHistoryPage.serviceInformationBanner).toBeVisible()
      await expect(alcoholMonitoringEventHistoryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the search page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('5678', [
        {
          legacySubjectId: '09876',
          type: 'incident',
          dateTime: '2022-02-02T01:03:03Z',
          details: {
            violationAlertId: 'V001',
          },
        },
      ])
      await mockAlcoholMonitoringApi.stubGetContactEvents('5678', [])
      await mockAlcoholMonitoringApi.stubGetViolationEvents('5678', [])

      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringEventHistoryPage.backLink.click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderDetailsPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('1234', [
        {
          legacySubjectId: '09876',
          type: 'incident',
          dateTime: '2022-02-02T01:03:03Z',
          details: {
            violationAlertId: 'V001',
          },
        },
      ])
      await mockAlcoholMonitoringApi.stubGetContactEvents('1234', [])
      await mockAlcoholMonitoringApi.stubGetViolationEvents('1234', [])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await alcoholMonitoringEventHistoryPage.checkIsAccessible()
    })
  })

  test.describe('Event history timeline with no entries', () => {
    test('Displays a message when no results are found', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('11111111', [])
      await mockAlcoholMonitoringApi.stubGetContactEvents('11111111', [])
      await mockAlcoholMonitoringApi.stubGetViolationEvents('11111111', [])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      await expect(alcoholMonitoringEventHistoryPage.eventHistory.element).not.toBeVisible()
      await expect(alcoholMonitoringEventHistoryPage.eventHistory.noResultsHeading).toBeVisible()
      await expect(alcoholMonitoringEventHistoryPage.eventHistory.noResultsMessage).toBeVisible()
    })
  })

  test.describe('Event history timeline with entries', () => {
    test('Displays an event history timeline with one of each event type', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('11111111', [
        {
          legacySubjectId: '11111111',
          type: 'incident',
          dateTime: '2022-02-02T01:06:06Z',
          details: {
            violationAlertId: 'V001',
            violationAlertDateTime: '2021-01-01T01:01:01Z',
            violationAlertType: 'Test alert type',
            violationAlertResponseAction: 'Test response action',
            visitRequired: 'No',
            probationInteractionRequired: 'No',
            amsInteractionRequired: 'Yes',
            multipleAlerts: 'Yes',
            additionalAlerts: 'Test additional alerts',
          },
        },
      ])

      await mockAlcoholMonitoringApi.stubGetContactEvents('11111111', [
        {
          legacySubjectId: '11111111',
          type: 'contact',
          dateTime: '2022-02-03T01:09:09Z',
          details: {
            contactDateTime: '2023-03-03T03:03:03Z',
            inboundOrOutbound: 'Inbound',
            fromTo: 'From',
            channel: 'Probation',
            subjectConsentWithdrawn: 'No',
            callOutcome: 'Test call outcome',
            statement: 'Test statement',
            reasonForContact: 'Test contact reason',
            outcomeOfContact: 'Test contact outcome',
            visitRequired: 'No ',
            visitId: 'V001',
          },
        },
      ])

      await mockAlcoholMonitoringApi.stubGetViolationEvents('11111111', [
        {
          legacySubjectId: '11111111',
          type: 'violation',
          dateTime: '2022-02-03T01:12:12Z',
          details: {
            enforcementId: 'E001',
            nonComplianceReason: 'Test noncompliance reason',
            nonComplianceDateTime: '2022-02-02T02:02:02Z',
            violationAlertId: 'V001',
            violationAlertDescription: 'Test alert description',
            violationEventNotificationDateTime: '2023-03-03T03:03:03Z',
            actionTakenEms: 'Test action taken EMS',
            nonComplianceOutcome: 'Test outcome',
            nonComplianceResolved: 'Yes',
            dateResolved: '2024-04-04T04:04:04Z',
            openClosed: 'Closed',
            visitRequired: 'No',
          },
        },
      ])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      await expect(alcoholMonitoringEventHistoryPage.eventHistory.getEntry(1).element).toBeVisible()
      await expect(alcoholMonitoringEventHistoryPage.eventHistory.getEntry(2).element).toBeVisible()
      await expect(alcoholMonitoringEventHistoryPage.eventHistory.getEntry(3).element).toBeVisible()
    })

    test('Displays an event history timeline with one incident event', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('11111111', [
        {
          legacySubjectId: '11111111',
          type: 'incident',
          dateTime: '2022-02-02T01:06:06Z',
          details: {
            violationAlertId: 'V001',
            violationAlertDateTime: '2021-01-01T01:01:01Z',
            violationAlertType: 'Test alert type',
            violationAlertResponseAction: 'Test response action',
            visitRequired: 'No',
            probationInteractionRequired: 'No',
            amsInteractionRequired: 'Yes',
            multipleAlerts: 'Yes',
            additionalAlerts: 'Test additional alerts',
          },
        },
      ])

      await mockAlcoholMonitoringApi.stubGetContactEvents('11111111', [])
      await mockAlcoholMonitoringApi.stubGetViolationEvents('11111111', [])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = alcoholMonitoringEventHistoryPage.eventHistory.getEntry(1)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('incident')
      await expect(event.date).toHaveText('2 Feb 2022 at 1:06am')

      const incidentSummaryCard = event.getDescription('Test alert type')
      await expect(incidentSummaryCard).toHaveItem('Violation alert ID', 'V001')
    })

    test('Displays an event history timeline with multiple incident events', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('33333333', [
        {
          legacySubjectId: '33333333',
          type: 'incident',
          dateTime: '2021-01-01T01:06:06Z',
          details: {
            violationAlertId: 'V001',
            violationAlertDateTime: '2021-01-01T01:01:01Z',
            violationAlertType: 'Test alert type',
            violationAlertResponseAction: 'Test response action',
            visitRequired: 'No',
            probationInteractionRequired: 'No',
            amsInteractionRequired: 'Yes',
            multipleAlerts: 'Yes',
            additionalAlerts: 'Test additional alerts',
          },
        },
        {
          legacySubjectId: '33333333',
          type: 'incident',
          dateTime: '2024-04-04T01:06:06Z',
          details: {
            violationAlertId: 'V002',
            violationAlertDateTime: '2024-04-04T01:01:01Z',
            violationAlertType: 'Test alert type 2',
            violationAlertResponseAction: 'Test response action 2',
            visitRequired: 'No',
            probationInteractionRequired: 'No',
            amsInteractionRequired: 'Yes',
            multipleAlerts: 'Yes',
            additionalAlerts: 'Test additional alerts 2',
          },
        },
      ])

      await mockAlcoholMonitoringApi.stubGetContactEvents('33333333', [])
      await mockAlcoholMonitoringApi.stubGetViolationEvents('33333333', [])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '33333333',
      })

      const event = alcoholMonitoringEventHistoryPage.eventHistory.getEntry(2)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('incident')
      await expect(event.date).toHaveText('4 Apr 2024 at 2:06am')

      const incidentSummaryCard = event.getDescription('Test alert type 2')
      await expect(incidentSummaryCard).toHaveItem('Violation alert ID', 'V002')
    })

    test('Displays an event history timeline with one contact event', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('11111111', [])

      await mockAlcoholMonitoringApi.stubGetContactEvents('11111111', [
        {
          legacySubjectId: '11111111',
          type: 'contact',
          dateTime: '2022-02-03T01:09:09Z',
          details: {
            contactDateTime: '2023-03-03T03:03:03Z',
            inboundOrOutbound: 'Inbound',
            fromTo: 'From',
            channel: 'Probation',
            subjectConsentWithdrawn: 'No',
            callOutcome: 'Test call outcome',
            statement: 'Test statement',
            reasonForContact: 'Test contact reason',
            outcomeOfContact: 'Test contact outcome',
            visitRequired: 'No ',
            visitId: 'V001',
          },
        },
      ])

      await mockAlcoholMonitoringApi.stubGetViolationEvents('11111111', [])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = alcoholMonitoringEventHistoryPage.eventHistory.getEntry(1)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('contact')
      await expect(event.date).toHaveText('3 Feb 2022 at 1:09am')

      const contactSummaryCard = event.getDescription('Probation')
      await expect(contactSummaryCard).toHaveItem('Contact channel', 'Probation')
      await expect(contactSummaryCard).toHaveItem('Outcome of contact', 'Test contact outcome')
      await expect(contactSummaryCard).toHaveItem('Reason for contact', 'Test contact reason')
    })

    test('Displays an event history timeline with multiple contact events', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('11111111', [])

      await mockAlcoholMonitoringApi.stubGetContactEvents('11111111', [
        {
          legacySubjectId: '11111111',
          type: 'contact',
          dateTime: '2022-02-03T01:09:09Z',
          details: {
            visitId: 'V001',
          },
        },
        {
          legacySubjectId: '11111111',
          type: 'contact',
          dateTime: '2026-04-04T01:09:09Z',
          details: {
            contactDateTime: '2023-03-03T03:03:03Z',
            inboundOrOutbound: 'Inbound',
            fromTo: 'From',
            channel: 'Probation',
            subjectConsentWithdrawn: 'No',
            callOutcome: 'Test call outcome',
            statement: 'Test statement',
            reasonForContact: 'Test contact reason',
            outcomeOfContact: 'Test contact outcome',
            visitRequired: 'No ',
            visitId: 'V002',
          },
        },
      ])

      await mockAlcoholMonitoringApi.stubGetViolationEvents('11111111', [])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = alcoholMonitoringEventHistoryPage.eventHistory.getEntry(2)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('contact')
      await expect(event.date).toHaveText('4 Apr 2026 at 2:09am')

      const contactSummaryCard = event.getDescription('Probation')
      await expect(contactSummaryCard).toHaveItem('Contact channel', 'Probation')
      await expect(contactSummaryCard).toHaveItem('Outcome of contact', 'Test contact outcome')
      await expect(contactSummaryCard).toHaveItem('Reason for contact', 'Test contact reason')
    })

    test('Displays an event history timeline with one violation event', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('11111111', [])
      await mockAlcoholMonitoringApi.stubGetContactEvents('11111111', [])

      await mockAlcoholMonitoringApi.stubGetViolationEvents('11111111', [
        {
          legacySubjectId: '11111111',
          type: 'violation',
          dateTime: '2022-02-03T01:12:12Z',
          details: {
            enforcementId: 'E001',
            nonComplianceReason: 'Test noncompliance reason',
            nonComplianceDateTime: '2022-02-02T02:02:02Z',
            violationAlertId: 'V001',
            violationAlertDescription: 'Test alert description',
            violationEventNotificationDateTime: '2023-03-03T03:03:03Z',
            actionTakenEms: 'Test action taken EMS',
            nonComplianceOutcome: 'Test outcome',
            nonComplianceResolved: 'Yes',
            dateResolved: '2024-04-04T04:04:04Z',
            openClosed: 'Closed',
            visitRequired: 'No',
          },
        },
      ])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = alcoholMonitoringEventHistoryPage.eventHistory.getEntry(1)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('violation')
      await expect(event.date).toHaveText('3 Feb 2022 at 1:12am')

      const violationSummaryCard = event.getDescription('violation')
      await expect(violationSummaryCard).toHaveItem('Enforcement ID', 'E001')
      await expect(violationSummaryCard).toHaveItem('Non-compliance reason', 'Test noncompliance reason')
      await expect(violationSummaryCard).toHaveItem('Non-compliance date', '2 February 2022')
      await expect(violationSummaryCard).toHaveItem('Non-compliance time', '2:02am')
    })

    test('Displays an event history timeline with multiple violation events', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('11111111', [])
      await mockAlcoholMonitoringApi.stubGetContactEvents('11111111', [])

      await mockAlcoholMonitoringApi.stubGetViolationEvents('11111111', [
        {
          legacySubjectId: '11111111',
          type: 'violation',
          dateTime: '2021-01-01T01:12:12Z',
          details: {
            enforcementId: 'E001',
          },
        },
        {
          legacySubjectId: '11111111',
          type: 'violation',
          dateTime: '2022-02-03T01:12:12Z',
          details: {
            enforcementId: 'E002',
            nonComplianceReason: 'Test noncompliance reason',
            nonComplianceDateTime: '2022-02-02T02:02:02Z',
            violationAlertId: 'V001',
            violationAlertDescription: 'Test alert description',
            violationEventNotificationDateTime: '2023-03-03T03:03:03Z',
            actionTakenEms: 'Test action taken EMS',
            nonComplianceOutcome: 'Test outcome',
            nonComplianceResolved: 'Yes',
            dateResolved: '2024-04-04T04:04:04Z',
            openClosed: 'Closed',
            visitRequired: 'No',
          },
        },
      ])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '11111111',
      })

      const event = alcoholMonitoringEventHistoryPage.eventHistory.getEntry(2)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('violation')
      await expect(event.date).toHaveText('3 Feb 2022 at 1:12am')

      const violationSummaryCard = event.getDescription('violation')
      await expect(violationSummaryCard).toHaveItem('Enforcement ID', 'E002')
      await expect(violationSummaryCard).toHaveItem('Non-compliance reason', 'Test noncompliance reason')
      await expect(violationSummaryCard).toHaveItem('Non-compliance date', '2 February 2022')
      await expect(violationSummaryCard).toHaveItem('Non-compliance time', '2:02am')
      await expect(violationSummaryCard).toHaveItem('Violation alert ID', 'V001')
      await expect(violationSummaryCard).toHaveItem('Violation alert description', 'Test alert description')
      await expect(violationSummaryCard).toHaveItem('Violation event notification date', '3 March 2023')
      await expect(violationSummaryCard).toHaveItem('Violation event notification time', '3:03am')
      await expect(violationSummaryCard).toHaveItem('Action taken EMS', 'Test action taken EMS')
      await expect(violationSummaryCard).toHaveItem('Non-compliance outcome', 'Test outcome')
      await expect(violationSummaryCard).toHaveItem('Non-compliance resolved', 'Yes')
      await expect(violationSummaryCard).toHaveItem('Date resolved', '4 April 2024')
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test.beforeEach(async () => {
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('09876', [
        {
          legacySubjectId: '09876',
          type: 'incident',
          dateTime: '2022-02-02T01:03:03Z',
          details: {
            violationAlertId: 'V001',
            violationAlertDateTime: '2021-01-01T01:01:01Z',
            violationAlertType: 'Test alert type',
            violationAlertResponseAction: 'Test response action',
            visitRequired: 'No',
            probationInteractionRequired: 'No',
            amsInteractionRequired: 'Yes',
            multipleAlerts: 'Yes',
            additionalAlerts: 'Test additional alerts',
          },
        },
      ])
      await mockAlcoholMonitoringApi.stubGetContactEvents('09876', [])
      await mockAlcoholMonitoringApi.stubGetViolationEvents('09876', [])
    })

    test('Navigates to the order summary page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('09876', {
        legacySubjectId: '09876',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringEventHistoryPage.subNavigationLink('Summary').click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderSummaryPage, page)
    })

    test('Navigates to the order details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('09876', {
        legacySubjectId: '09876',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringEventHistoryPage.subNavigationLink('Details').click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderDetailsPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('09876', [
        {
          legacySubjectId: '09876',
        },
      ])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringEventHistoryPage.subNavigationLink('Equipment').click()

      await AppPage.verifyOnPage(AlcoholMonitoringEquipmentHistoryPage, page)
    })

    test('Navigates to the service details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetServiceDetails('09876', [
        {
          legacySubjectId: '09876',
        },
      ])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringEventHistoryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(AlcoholMonitoringServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('09876', [
        {
          legacySubjectId: '09876',
          actualWorkStartDateTime: '2024-06-01T09:00:00',
        },
      ])

      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringEventHistoryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(AlcoholMonitoringVisitHistoryPage, page)
    })

    test('Navigates to the event history page', async ({ page }) => {
      const alcoholMonitoringEventHistoryPage = await AppPage.visit(AlcoholMonitoringEventHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringEventHistoryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(AlcoholMonitoringEventHistoryPage, page)
    })
  })
})
