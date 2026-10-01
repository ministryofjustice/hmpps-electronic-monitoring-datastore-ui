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

test.describe('Integrity service history', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test.beforeEach(async () => {
      await mockIntegrityApi.stubGetServiceDetails('test-service-history-id', false, [
        {
          legacySubjectId: 'test-service-history-id',
          serviceId: 321,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 7,
        },
      ])
    })

    test('can see their user name', async ({ page }) => {
      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: 'test-service-history-id',
      })

      await expect(integrityServiceHistoryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: 'test-service-history-id',
      })

      await expect(integrityServiceHistoryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: 'test-service-history-id',
      })

      await expect(integrityServiceHistoryPage.serviceInformationBanner).toBeVisible()
      await expect(integrityServiceHistoryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the search page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('test-service-history-id', false, {
        specials: 'no',
        legacySubjectId: 'test-service-history-id',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: 'test-service-history-id',
      })

      await integrityServiceHistoryPage.backLink.click()

      await AppPage.verifyOnPage(IntegrityOrderDetailsPage, page)
    })

    test('Is accessible', async ({ page }) => {
      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: 'test-service-history-id',
      })

      await integrityServiceHistoryPage.checkIsAccessible()
    })
  })

  test.describe('Service history timeline with no entries', () => {
    test('Displays a message when no results are found', async ({ page }) => {
      await mockIntegrityApi.stubGetServiceDetails('test-legacy-subject-001', false, [])

      const serviceDetailsPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: 'test-legacy-subject-001',
      })

      await expect(serviceDetailsPage.serviceHistory.element).not.toBeVisible()
      await expect(serviceDetailsPage.serviceHistory.noResultsHeading).toBeVisible()
      await expect(serviceDetailsPage.serviceHistory.noResultsMessage).toBeVisible()
    })
  })

  test.describe('Service history timeline with entries', () => {
    test('Displays a service history timeline with one entry', async ({ page }) => {
      await mockIntegrityApi.stubGetServiceDetails('test-legacy-subject-004', false, [
        {
          legacySubjectId: 'test-legacy-subject-004',
          serviceId: 321,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostCode: 'postCode',
          serviceStartDate: '2002-05-22T01:01:01+00:00',
          serviceEndDate: '2002-05-22T01:01:01+00:00',
          curfewStartDate: '2002-05-22T01:01:01+00:00',
          curfewEndDate: '2002-05-22T01:01:01+00:00',
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 7,
        },
      ])

      const serviceDetailsPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: 'test-legacy-subject-004',
      })

      await expect(serviceDetailsPage.serviceHistory.element).toBeVisible()
      await expect(serviceDetailsPage.serviceHistory).toHaveEntries(1)
      await expect(serviceDetailsPage.serviceHistory.getEntry(1).element).toContainText('Service ID 321')
    })

    test('Displays a service history timeline with multiple entries', async ({ page }) => {
      await mockIntegrityApi.stubGetServiceDetails('test-legacy-subject-005', false, [
        {
          legacySubjectId: 'test-legacy-subject-005',
          serviceId: 321,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostCode: 'postCode',
          serviceStartDate: '2002-05-22T01:01:01+00:00',
          serviceEndDate: '2002-05-22T01:01:01+00:00',
          curfewStartDate: '2002-05-22T01:01:01+00:00',
          curfewEndDate: '2002-05-22T01:01:01+00:00',
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 7,
        },
        {
          legacySubjectId: 'test-legacy-subject-005',
          serviceId: 654,
          serviceAddress1: 'address line 1',
          serviceAddress2: 'address line 2',
          serviceAddress3: 'address line 3',
          serviceAddressPostCode: 'postCode',
          serviceStartDate: '2002-05-22T01:01:01+00:00',
          serviceEndDate: '2002-05-22T01:01:01+00:00',
          curfewStartDate: '2002-05-22T01:01:01+00:00',
          curfewEndDate: '2002-05-22T01:01:01+00:00',
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 7,
        },
      ])

      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: 'test-legacy-subject-005',
      })

      await expect(integrityServiceHistoryPage.serviceHistory.element).toBeVisible()
      await expect(integrityServiceHistoryPage.serviceHistory).toHaveEntries(2)
      await expect(integrityServiceHistoryPage.serviceHistory.getEntry(1).element).toContainText('Service ID 321')
      await expect(integrityServiceHistoryPage.serviceHistory.getEntry(2).element).toContainText('Service ID 654')
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test.beforeEach(async () => {
      await mockIntegrityApi.stubGetServiceDetails('09876', false, [
        {
          legacySubjectId: '09876',
          serviceId: 19876,
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
          sunday: 1,
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

      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityServiceHistoryPage.subNavigationLink('Summary').click()

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

      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityServiceHistoryPage.subNavigationLink('Details').click()

      await AppPage.verifyOnPage(IntegrityOrderDetailsPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('09876', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityServiceHistoryPage.subNavigationLink('Equipment').click()

      await AppPage.verifyOnPage(IntegrityEquipmentHistoryPage, page)
    })

    test('Navigates to the service details page', async ({ page }) => {
      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityServiceHistoryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(IntegrityServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockIntegrityApi.stubGetVisitDetails('09876', false, [
        {
          legacySubjectId: '09876',
          actualWorkStartDateTime: '2024-06-01T09:00:00+00:00',
        },
      ])

      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityServiceHistoryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(IntegrityVisitHistoryPage, page)
    })

    test('Navigates to the suspension of visits page', async ({ page }) => {
      await mockIntegrityApi.stubGetSuspensionOfVisits('09876', false, [
        {
          legacySubjectId: '09876',
        },
      ])

      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityServiceHistoryPage.subNavigationLink('Suspension of visits').click()

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

      const integrityServiceHistoryPage = await AppPage.visit(IntegrityServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await integrityServiceHistoryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(IntegrityEventHistoryPage, page)
    })
  })
})
