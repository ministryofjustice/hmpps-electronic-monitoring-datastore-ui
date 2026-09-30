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

test.describe('AlcoholMonitoring visits history', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('1234', [])

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(alcoholMonitoringVisitHistoryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('1234', [])

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(alcoholMonitoringVisitHistoryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('1234', [])

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(alcoholMonitoringVisitHistoryPage.serviceInformationBanner).toBeVisible()
      await expect(alcoholMonitoringVisitHistoryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the order details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('5678', [
        {
          legacySubjectId: '5678',
          actualWorkStartDateTime: '2002-05-22T01:01:01',
        },
      ])

      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringVisitHistoryPage.backLink.click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderDetailsPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('1234', [])

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await alcoholMonitoringVisitHistoryPage.checkIsAccessible()
    })
  })

  test.describe('Visit history timeline with no entries', () => {
    test('Displays a message when no results are found', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('0000', [])

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '0000',
      })

      await expect(alcoholMonitoringVisitHistoryPage.visitHistory.element).not.toBeVisible()
      await expect(alcoholMonitoringVisitHistoryPage.visitHistory.noResultsHeading).toBeVisible()
      await expect(alcoholMonitoringVisitHistoryPage.visitHistory.noResultsMessage).toBeVisible()
    })
  })

  test.describe('Visit history timeline with entries', () => {
    test('Displays a visit history timeline with one entry', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('1234', [
        {
          legacySubjectId: '1234',
          visitId: '300',
          visitType: 'TEST_VISIT_TYPE',
          visitAttempt: 'attempt 1',
          dateVisitRaised: '2001-01-01T00:00:00',
          visitAddress: 'address line 1 address line 2 address line 3 postCode',
          visitNotes: 'TEST_NOTES',
          visitOutcome: 'TEST_OUTCOME',
          actualWorkStartDateTime: '2002-02-02T01:01:01',
          actualWorkEndDateTime: '2002-02-02T02:02:02',
          visitRejectionReason: 'rejection reason',
          visitRejectionDescription: 'rejection description',
          visitCancelReason: 'cancel reason',
          visitCancelDescription: 'cancel description',
        },
      ])

      const visitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, { legacySubjectId: '1234' })
      await expect(visitHistoryPage.visitHistory.element).toBeVisible()

      const visitHistory = visitHistoryPage.visitHistory.getEntry(1)
      await expect(visitHistory.title).toHaveText('TEST_VISIT_TYPE')

      const summaryCard = visitHistory.getDescription('TEST_VISIT_TYPE')
      await expect(summaryCard).toHaveItem('Visit address', 'address line 1 address line 2 address line 3 postCode')
      await expect(summaryCard).toHaveItem('Actual work start datetime', '2 February 2002 at 1:01am')
      await expect(summaryCard).toHaveItem('Actual work end datetime', '2 February 2002 at 2:02am')
      await expect(summaryCard).toHaveItem('Visit notes', 'TEST_NOTES')
      await expect(summaryCard).toHaveItem('Visit outcome', 'TEST_OUTCOME')
    })

    test('displays a visit history timeline with multiple entries', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('1234', [
        {
          legacySubjectId: '1234',
          visitId: '300',
          visitType: 'TEST_VISIT_TYPE',
          visitAttempt: 'attempt 1',
          dateVisitRaised: '2001-01-01T00:00:00',
          visitAddress: 'address line 1 address line 2 address line 3 postCode',
          visitNotes: 'TEST_NOTES',
          visitOutcome: 'TEST_OUTCOME',
          actualWorkStartDateTime: '2002-02-02T01:01:01',
          actualWorkEndDateTime: '2002-02-02T02:02:02',
          visitRejectionReason: 'rejection reason',
          visitRejectionDescription: 'rejection description',
          visitCancelReason: 'cancel reason',
          visitCancelDescription: 'cancel description',
        },
        {
          legacySubjectId: '1234',
          visitId: '302',
          visitType: 'TEST_VISIT_TYPE_2',
          visitAttempt: 'attempt 2',
          dateVisitRaised: '2001-01-01T00:00:00',
          visitAddress: 'address line 1 address line 2 address line 3 postCode',
          visitNotes: 'TEST_NOTES_2',
          visitOutcome: 'TEST_OUTCOME_2',
          actualWorkStartDateTime: '2002-02-02T01:01:01',
          actualWorkEndDateTime: '2002-02-02T02:02:02',
          visitRejectionReason: 'rejection reason 2',
          visitRejectionDescription: 'rejection description 2',
          visitCancelReason: 'cancel reason 2',
          visitCancelDescription: 'cancel description 2',
        },
      ])

      const visitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, { legacySubjectId: '1234' })

      const visitHistory = visitHistoryPage.visitHistory.getEntry(2)
      await expect(visitHistory.title).toHaveText('TEST_VISIT_TYPE_2')

      const summaryCard = visitHistory.getDescription('TEST_VISIT_TYPE_2')
      await expect(summaryCard).toHaveItem('Visit address', 'address line 1 address line 2 address line 3 postCode')
      await expect(summaryCard).toHaveItem('Actual work start datetime', '2 February 2002 at 1:01am')
      await expect(summaryCard).toHaveItem('Actual work end datetime', '2 February 2002 at 2:02am')
      await expect(summaryCard).toHaveItem('Visit notes', 'TEST_NOTES_2')
      await expect(summaryCard).toHaveItem('Visit outcome', 'TEST_OUTCOME_2')
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test.beforeEach(async () => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('09835', [
        {
          legacySubjectId: '09835',
          actualWorkStartDateTime: '2002-02-02T01:01:01',
        },
      ])
    })

    test('Navigates to the order summary page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('09835', {
        legacySubjectId: '09835',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await alcoholMonitoringVisitHistoryPage.subNavigationLink('Summary').click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderSummaryPage, page)
    })

    test('Navigates to the order details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('09835', {
        legacySubjectId: '09835',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await alcoholMonitoringVisitHistoryPage.subNavigationLink('Details').click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderDetailsPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('09835', [
        {
          legacySubjectId: '09835',
        },
      ])

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await alcoholMonitoringVisitHistoryPage.subNavigationLink('Equipment').click()

      await AppPage.verifyOnPage(AlcoholMonitoringEquipmentHistoryPage, page)
    })

    test('Navigates to the service details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetServiceDetails('09835', [
        {
          legacySubjectId: '09835',
        },
      ])

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await alcoholMonitoringVisitHistoryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(AlcoholMonitoringServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('09835', [
        {
          legacySubjectId: '09835',
          actualWorkStartDateTime: '2024-06-01T09:00:00',
        },
      ])

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await alcoholMonitoringVisitHistoryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(AlcoholMonitoringVisitHistoryPage, page)
    })

    test('Navigates to the event history page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetViolationEvents('09835', [
        {
          legacySubjectId: '09835',
          type: 'VIOLATION',
          dateTime: '2024-06-01T09:00:00',
          details: {},
        },
      ])
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('09835', [
        {
          legacySubjectId: '09835',
          type: 'INCIDENT',
          dateTime: '2024-06-01T09:00:00',
          details: {},
        },
      ])
      await mockAlcoholMonitoringApi.stubGetContactEvents('09835', [
        {
          legacySubjectId: '09876',
          type: 'CONTACT',
          dateTime: '2024-06-01T09:00:00',
          details: {},
        },
      ])

      const alcoholMonitoringVisitHistoryPage = await AppPage.visit(AlcoholMonitoringVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await alcoholMonitoringVisitHistoryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(AlcoholMonitoringEventHistoryPage, page)
    })
  })
})
