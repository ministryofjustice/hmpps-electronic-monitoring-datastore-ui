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

test.describe('Integrity visits history', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('1234', false, [])

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(integrityVisitHistoryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('1234', false, [])

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(integrityVisitHistoryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('1234', false, [])

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(integrityVisitHistoryPage.serviceInformationBanner).toBeVisible()
      await expect(integrityVisitHistoryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the search page', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('5678', false, [
        {
          legacySubjectId: '5678',
          actualWorkStartDateTime: '2002-05-22T01:01:01Z',
        },
      ])

      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityVisitHistoryPage.backLink.click()

      await AppPage.verifyOnPage(IntegrityOrderDetailsPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('1234', false, [])

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await integrityVisitHistoryPage.checkIsAccessible()
    })
  })

  test.describe('Visit history timeline with no entries', () => {
    test('Displays a message when no results are found', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('0000', false, [])

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '0000',
      })

      await expect(integrityVisitHistoryPage.visitHistory.element).not.toBeVisible()
      await expect(integrityVisitHistoryPage.visitHistory.noResultsHeading).toBeVisible()
      await expect(integrityVisitHistoryPage.visitHistory.noResultsMessage).toBeVisible()
    })
  })

  test.describe('Visit history timeline with entries', () => {
    test('Displays a visit history timeline with one entry', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('1234', false, [
        {
          legacySubjectId: '1234',
          address: {
            addressLine1: 'address line 1',
            addressLine2: 'address line 2',
            addressLine3: 'address line 3',
            addressLine4: 'address line 4',
            postcode: 'postCode',
          },
          actualWorkStartDateTime: '2002-02-02T01:01:01Z',
          actualWorkEndDateTime: '2002-02-02T02:02:02Z',
          visitNotes: 'TEST_NOTES',
          visitType: 'TEST_VISIT_TYPE',
          visitOutcome: 'TEST_OUTCOME',
        },
      ])

      const visitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, { legacySubjectId: '1234' })
      await expect(visitHistoryPage.visitHistory.element).toBeVisible()

      const visitHistory = visitHistoryPage.visitHistory.getEntry(1)
      await expect(visitHistory.title).toHaveText('TEST_VISIT_TYPE')

      const summaryCard = visitHistory.getDescription('TEST_VISIT_TYPE')
      await expect(summaryCard).toHaveItem(
        'Address',
        'address line 1\naddress line 2\naddress line 3\naddress line 4\npostCode',
      )
      await expect(summaryCard).toHaveItem('Actual work start date', '2 February 2002')
      await expect(summaryCard).toHaveItem('Actual work start time', '1:01am')
      await expect(summaryCard).toHaveItem('Actual work end date', '2 February 2002')
      await expect(summaryCard).toHaveItem('Actual work end time', '2:02am')
      await expect(summaryCard).toHaveItem('Notes', 'TEST_NOTES')
      await expect(summaryCard).toHaveItem('Outcome', 'TEST_OUTCOME')
    })

    test('displays a visit history timeline with multiple entries', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('1234', false, [
        {
          legacySubjectId: '1234',
          address: {
            addressLine1: 'address line 1',
            addressLine2: 'address line 2',
            addressLine3: 'address line 3',
            addressLine4: 'address line 4',
            postcode: 'postCode',
          },
          actualWorkStartDateTime: '2002-02-02T01:01:01Z',
          actualWorkEndDateTime: '2002-02-02T02:02:02Z',
          visitNotes: 'TEST_NOTES',
          visitType: 'TEST_VISIT_TYPE',
          visitOutcome: 'TEST_OUTCOME',
        },
        {
          legacySubjectId: '321',
          address: {
            addressLine1: 'address line 5',
            addressLine2: 'address line 6',
            addressLine3: 'address line 7',
            addressLine4: 'address line 8',
            postcode: 'postCode 2',
          },
          actualWorkStartDateTime: '2002-02-02T03:03:03Z',
          actualWorkEndDateTime: '2002-02-02T04:04:04Z',
          visitNotes: 'TEST_NOTES_2',
          visitType: 'TEST_VISIT_TYPE_2',
          visitOutcome: 'TEST_OUTCOME_2',
        },
      ])

      const visitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, { legacySubjectId: '1234' })

      const visitHistory = visitHistoryPage.visitHistory.getEntry(2)
      await expect(visitHistory.title).toHaveText('TEST_VISIT_TYPE_2')

      const summaryCard = visitHistory.getDescription('TEST_VISIT_TYPE_2')
      await expect(summaryCard).toHaveItem(
        'Address',
        'address line 5\naddress line 6\naddress line 7\naddress line 8\npostCode 2',
      )
      await expect(summaryCard).toHaveItem('Actual work start date', '2 February 2002')
      await expect(summaryCard).toHaveItem('Actual work start time', '3:03am')
      await expect(summaryCard).toHaveItem('Actual work end date', '2 February 2002')
      await expect(summaryCard).toHaveItem('Actual work end time', '4:04am')
      await expect(summaryCard).toHaveItem('Notes', 'TEST_NOTES_2')
      await expect(summaryCard).toHaveItem('Outcome', 'TEST_OUTCOME_2')
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test.beforeEach(async () => {
      await mockIntegrityApi.stubGetVisitDetails('09835', false, [
        {
          legacySubjectId: '09835',
          actualWorkStartDateTime: '2002-02-02T01:01:01Z',
        },
      ])
    })

    test('Navigates to the order summary page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('09835', false, {
        specials: 'no',
        legacySubjectId: '09835',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await integrityVisitHistoryPage.subNavigationLink('Summary').click()

      await AppPage.verifyOnPage(IntegrityOrderSummaryPage, page)
    })

    test('Navigates to the order details page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('09835', false, {
        specials: 'no',
        legacySubjectId: '09835',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await integrityVisitHistoryPage.subNavigationLink('Details').click()

      await AppPage.verifyOnPage(IntegrityOrderDetailsPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('09835', false, [
        {
          legacySubjectId: '09835',
        },
      ])

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await integrityVisitHistoryPage.subNavigationLink('Equipment').click()

      await AppPage.verifyOnPage(IntegrityEquipmentHistoryPage, page)
    })

    test('Navigates to the service details page', async ({ page }) => {
      await mockIntegrityApi.stubGetServiceDetails('09835', false, [
        {
          legacySubjectId: '09835',
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

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await integrityVisitHistoryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(IntegrityServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('09835', false, [
        {
          legacySubjectId: '09835',
          actualWorkStartDateTime: '2024-06-01T09:00:00Z',
        },
      ])

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await integrityVisitHistoryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(IntegrityVisitHistoryPage, page)
    })

    test('Navigates to the suspension of visits page', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('09835', false, [
        {
          legacySubjectId: '09835',
        },
      ])

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await integrityVisitHistoryPage.subNavigationLink('Suspension of visits').click()

      await AppPage.verifyOnPage(IntegritySuspensionOfVisitsHistoryPage, page)
    })

    test('Navigates to the event history page', async ({ page }) => {
      await mockIntegrityApi.stubGetViolationEvents('09835', false, [
        {
          legacySubjectId: '09835',
          type: 'VIOLATION',
          dateTime: '2024-06-01T09:00:00Z',
          details: {},
        },
      ])
      await mockIntegrityApi.stubGetIncidentEvents('09835', false, [
        {
          legacySubjectId: '09835',
          type: 'INCIDENT',
          dateTime: '2024-06-01T09:00:00Z',
          details: {},
        },
      ])
      await mockIntegrityApi.stubGetMonitoringEvents('09835', false, [
        {
          legacySubjectId: '09835',
          type: 'MONITORING',
          dateTime: '2024-06-01T09:00:00Z',
          details: {},
        },
      ])
      await mockIntegrityApi.stubGetContactEvents('09835', false, [
        {
          legacySubjectId: '09835',
          type: 'CONTACT',
          dateTime: '2024-06-01T09:00:00Z',
          details: {},
        },
      ])

      const integrityVisitHistoryPage = await AppPage.visit(IntegrityVisitHistoryPage, page, {
        legacySubjectId: '09835',
      })

      await integrityVisitHistoryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(IntegrityEventHistoryPage, page)
    })
  })
})
