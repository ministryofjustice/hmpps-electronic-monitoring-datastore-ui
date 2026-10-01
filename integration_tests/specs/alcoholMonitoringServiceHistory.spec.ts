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

test.describe('AlcoholMonitoring service history', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test.beforeEach(async () => {
      await mockAlcoholMonitoringApi.stubGetServiceDetails('test-service-history-id', [
        {
          legacySubjectId: 'test-service-history-id',
          serviceStartDate: '2001-01-01T00:00:00+00:00',
          serviceEndDate: '2002-02-02T00:00:00+00:00',
          serviceAddress: 'service address',
          equipmentStartDate: '2003-03-03T00:00:00+00:00',
          equipmentEndDate: '2004-04-04T00:00:00+00:00',
          hmuSerialNumber: 'hmu-01',
          deviceSerialNumber: 'device-01',
        },
      ])
    })

    test('can see their user name', async ({ page }) => {
      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: 'test-service-history-id',
      })

      await expect(alcoholMonitoringServiceHistoryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: 'test-service-history-id',
      })

      await expect(alcoholMonitoringServiceHistoryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: 'test-service-history-id',
      })

      await expect(alcoholMonitoringServiceHistoryPage.serviceInformationBanner).toBeVisible()
      await expect(alcoholMonitoringServiceHistoryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the order details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('test-service-history-id', {
        legacySubjectId: 'test-service-history-id',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: 'test-service-history-id',
      })

      await alcoholMonitoringServiceHistoryPage.backLink.click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderDetailsPage, page)
    })

    test('Is accessible', async ({ page }) => {
      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: 'test-service-history-id',
      })

      await alcoholMonitoringServiceHistoryPage.checkIsAccessible()
    })
  })

  test.describe('Service history timeline with no entries', () => {
    test('Displays a message when no results are found', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetServiceDetails('test-legacy-subject-001', [])

      const serviceDetailsPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: 'test-legacy-subject-001',
      })

      await expect(serviceDetailsPage.serviceHistory.element).not.toBeVisible()
      await expect(serviceDetailsPage.serviceHistory.noResultsHeading).toBeVisible()
      await expect(serviceDetailsPage.serviceHistory.noResultsMessage).toBeVisible()
    })
  })

  test.describe('Service history timeline with entries', () => {
    test('Displays a service history timeline with one entry', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetServiceDetails('test-legacy-subject-004', [
        {
          legacySubjectId: 'test-legacy-subject-004',
          serviceStartDate: '2001-01-01T00:00:00+00:00',
          serviceEndDate: '2002-02-02T00:00:00+00:00',
          serviceAddress: 'service address',
          equipmentStartDate: '2003-03-03T00:00:00+00:00',
          equipmentEndDate: '2004-04-04T00:00:00+00:00',
          hmuSerialNumber: 'hmu-01',
          deviceSerialNumber: 'device-01',
        },
      ])

      const serviceDetailsPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: 'test-legacy-subject-004',
      })

      await expect(serviceDetailsPage.serviceHistory.element).toBeVisible()
      await expect(serviceDetailsPage.serviceHistory).toHaveEntries(1)
      await expect(serviceDetailsPage.serviceHistory.getEntry(1).element).toContainText('HMU Serial Number hmu-01')
    })

    test('Displays a service history timeline with multiple entries', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetServiceDetails('test-legacy-subject-005', [
        {
          legacySubjectId: 'test-legacy-subject-005',
          serviceStartDate: '2001-01-01T00:00:00+00:00',
          serviceEndDate: '2002-02-02T00:00:00+00:00',
          serviceAddress: 'service address',
          equipmentStartDate: '2003-03-03T00:00:00+00:00',
          equipmentEndDate: '2004-04-04T00:00:00+00:00',
          hmuSerialNumber: 'hmu-01',
          deviceSerialNumber: 'device-01',
        },
        {
          legacySubjectId: 'test-legacy-subject-005',
          serviceStartDate: '2001-01-01T00:00:00+00:00',
          serviceEndDate: '2002-02-02T00:00:00+00:00',
          serviceAddress: 'another service address',
          equipmentStartDate: '2003-03-03T00:00:00+00:00',
          equipmentEndDate: '2004-04-04T00:00:00+00:00',
          hmuSerialNumber: 'hmu-02',
          deviceSerialNumber: 'device-02',
        },
      ])

      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: 'test-legacy-subject-005',
      })

      await expect(alcoholMonitoringServiceHistoryPage.serviceHistory.element).toBeVisible()
      await expect(alcoholMonitoringServiceHistoryPage.serviceHistory).toHaveEntries(2)
      await expect(alcoholMonitoringServiceHistoryPage.serviceHistory.getEntry(1).element).toContainText(
        'HMU Serial Number hmu-01',
      )
      await expect(alcoholMonitoringServiceHistoryPage.serviceHistory.getEntry(2).element).toContainText(
        'HMU Serial Number hmu-02',
      )
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test.beforeEach(async () => {
      await mockAlcoholMonitoringApi.stubGetServiceDetails('09876', [
        {
          legacySubjectId: '09876',
          serviceStartDate: '2001-01-01T00:00:00+00:00',
          serviceEndDate: '2002-02-02T00:00:00+00:00',
          serviceAddress: 'service address',
          equipmentStartDate: '2003-03-03T00:00:00+00:00',
          equipmentEndDate: '2004-04-04T00:00:00+00:00',
          hmuSerialNumber: 'hmu-01',
          deviceSerialNumber: 'device-01',
        },
      ])
    })

    test('Navigates to the order summary page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('09876', {
        legacySubjectId: '09876',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringServiceHistoryPage.subNavigationLink('Summary').click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderSummaryPage, page)
    })

    test('Navigates to the order details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('09876', {
        legacySubjectId: '09876',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringServiceHistoryPage.subNavigationLink('Details').click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderDetailsPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('09876', [
        {
          legacySubjectId: '09876',
        },
      ])

      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringServiceHistoryPage.subNavigationLink('Equipment').click()

      await AppPage.verifyOnPage(AlcoholMonitoringEquipmentHistoryPage, page)
    })

    test('Navigates to the service details page', async ({ page }) => {
      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringServiceHistoryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(AlcoholMonitoringServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetVisitDetails('09876', [
        {
          legacySubjectId: '09876',
          actualWorkStartDateTime: '2024-06-01T09:00:00+00:00',
        },
      ])

      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringServiceHistoryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(AlcoholMonitoringVisitHistoryPage, page)
    })

    test('Navigates to the event history page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetViolationEvents('09876', [
        {
          legacySubjectId: '09876',
          type: 'VIOLATION',
          dateTime: '2024-06-01T09:00:00+00:00',
          details: {},
        },
      ])
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('09876', [
        {
          legacySubjectId: '09876',
          type: 'INCIDENT',
          dateTime: '2024-06-01T09:00:00+00:00',
          details: {},
        },
      ])
      await mockAlcoholMonitoringApi.stubGetContactEvents('09876', [
        {
          legacySubjectId: '09876',
          type: 'CONTACT',
          dateTime: '2024-06-01T09:00:00+00:00',
          details: {},
        },
      ])

      const alcoholMonitoringServiceHistoryPage = await AppPage.visit(AlcoholMonitoringServiceHistoryPage, page, {
        legacySubjectId: '09876',
      })

      await alcoholMonitoringServiceHistoryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(AlcoholMonitoringEventHistoryPage, page)
    })
  })
})
