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

test.describe('Integrity suspension of visits history', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('1234', false, [])

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(integritySuspensionOfVisitsHistoryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('1234', false, [])

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(integritySuspensionOfVisitsHistoryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('1234', false, [])

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await expect(integritySuspensionOfVisitsHistoryPage.serviceInformationBanner).toBeVisible()
      await expect(integritySuspensionOfVisitsHistoryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the search page', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('5678', false, [])

      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integritySuspensionOfVisitsHistoryPage.backLink.click()

      await AppPage.verifyOnPage(IntegrityOrderDetailsPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('1234', false, [])

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await integritySuspensionOfVisitsHistoryPage.checkIsAccessible()
    })
  })

  test.describe('Suspension of visits timeline with no entries', () => {
    test('Displays a message when no results are found', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('1234', false, [])

      const suspensions = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, { legacySubjectId: '1234' })

      await expect(suspensions.suspensionOfVisitsHistory.element).not.toBeVisible()
      await expect(suspensions.suspensionOfVisitsHistory.noResultsHeading).toBeVisible()
      await expect(suspensions.suspensionOfVisitsHistory.noResultsMessage).toBeVisible()
    })
  })

  test.describe('Suspension of visits timeline with entries', () => {
    test('Displays a suspension of visits timeline with one entry', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('1234', false, [
        {
          legacySubjectId: '123456789',
          suspensionOfVisits: 'Yes',
          requestedDate: '2001-01-01T01:01:01+00:00',
          startDate: '2001-01-01T01:01:01+00:00',
          startTime: '01:01:01',
          endDate: '2001-01-01T01:01:01+00:00',
        },
      ])

      const suspensions = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, { legacySubjectId: '1234' })

      await expect(suspensions.suspensionOfVisitsHistory.element).toBeVisible()
      await expect(suspensions.suspensionOfVisitsHistory).toHaveEntries(1)

      const entry = suspensions.suspensionOfVisitsHistory.getEntry(1)
      await expect(entry.getDescription('Suspension of Visits')).toHaveItem('Requested Date', '1 January 2001')
    })

    test('Displays a suspension of visits timeline with multiple entries', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('1234', false, [
        {
          legacySubjectId: '123456789',
          suspensionOfVisits: 'Yes',
          requestedDate: '2001-01-01T01:01:01+00:00',
          startDate: '2001-01-01T01:01:01+00:00',
          startTime: '01:01:01',
          endDate: '2001-01-01T01:01:01+00:00',
        },
        {
          legacySubjectId: '123456789',
          suspensionOfVisits: 'Yes',
          requestedDate: '2002-02-02T02:02:02+00:00',
          startDate: '2002-02-02T02:02:02+00:00',
          startTime: '02:02:02',
          endDate: '2002-02-02T02:02:02+00:00',
        },
        {
          legacySubjectId: '123456789',
          suspensionOfVisits: 'Yes',
          requestedDate: '2003-03-03T03:03:03+00:00',
          startDate: '2003-03-03T03:03:03+00:00',
          startTime: '03:03:03',
          endDate: '2003-03-03T03:03:03+00:00',
        },
      ])

      const suspensions = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, { legacySubjectId: '1234' })

      await expect(suspensions.suspensionOfVisitsHistory.element).toBeVisible()
      await expect(suspensions.suspensionOfVisitsHistory).toHaveEntries(3)

      const entry1 = suspensions.suspensionOfVisitsHistory.getEntry(1)
      await expect(entry1.getDescription('Suspension of Visits')).toHaveItem('Requested Date', '1 January 2001')

      const entry2 = suspensions.suspensionOfVisitsHistory.getEntry(2)
      await expect(entry2.getDescription('Suspension of Visits')).toHaveItem('Requested Date', '2 February 2002')

      const entry3 = suspensions.suspensionOfVisitsHistory.getEntry(3)
      await expect(entry3.getDescription('Suspension of Visits')).toHaveItem('Requested Date', '3 March 2003')
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test.beforeEach(async () => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('09876', false, [
        {
          legacySubjectId: '09876',
        },
      ])
    })

    test('Navigates to the order summary page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('09876', false, {
        specials: 'no',
        legacySubjectId: '09876',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integritySuspensionOfVisitsHistoryPage.subNavigationLink('Summary').click()

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

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integritySuspensionOfVisitsHistoryPage.subNavigationLink('Details').click()

      await AppPage.verifyOnPage(IntegrityOrderDetailsPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('09876', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integritySuspensionOfVisitsHistoryPage.subNavigationLink('Equipment').click()

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

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integritySuspensionOfVisitsHistoryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(IntegrityServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('09876', false, [
        {
          legacySubjectId: '09876',
          actualWorkStartDateTime: '2024-06-01T09:00:00+00:00',
        },
      ])

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integritySuspensionOfVisitsHistoryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(IntegrityVisitHistoryPage, page)
    })

    test('Navigates to the suspension of visits page', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('09876', false, [
        {
          legacySubjectId: '09876',
        },
      ])

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integritySuspensionOfVisitsHistoryPage.subNavigationLink('Suspension of visits').click()

      await AppPage.verifyOnPage(IntegritySuspensionOfVisitsHistoryPage, page)
    })

    test('Navigates to the event history page', async ({ page }) => {
      await mockIntegrityApi.stubGetViolationEvents('09876', false, [
        {
          legacySubjectId: '09876',
          type: 'VIOLATION',
          dateTime: '2024-06-01T09:00:00+00:00',
          details: {},
        },
      ])
      await mockIntegrityApi.stubGetIncidentEvents('09876', false, [
        {
          legacySubjectId: '09876',
          type: 'INCIDENT',
          dateTime: '2024-06-01T09:00:00+00:00',
          details: {},
        },
      ])
      await mockIntegrityApi.stubGetMonitoringEvents('09876', false, [
        {
          legacySubjectId: '09876',
          type: 'MONITORING',
          dateTime: '2024-06-01T09:00:00+00:00',
          details: {},
        },
      ])
      await mockIntegrityApi.stubGetContactEvents('09876', false, [
        {
          legacySubjectId: '09876',
          type: 'CONTACT',
          dateTime: '2024-06-01T09:00:00+00:00',
          details: {},
        },
      ])

      const integritySuspensionOfVisitsHistoryPage = await AppPage.visit(IntegritySuspensionOfVisitsHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integritySuspensionOfVisitsHistoryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(IntegrityEventHistoryPage, page)
    })
  })
})
