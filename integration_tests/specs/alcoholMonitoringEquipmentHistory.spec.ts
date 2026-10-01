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

test.describe('AlcoholMonitoring equipment history', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('2345', [
        {
          legacySubjectId: '2345',
        },
      ])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '2345',
      })

      await expect(alcoholMonitoringEquipmentHistoryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('3456', [
        {
          legacySubjectId: '3456',
        },
      ])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '3456',
      })

      await expect(alcoholMonitoringEquipmentHistoryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('4567', [
        {
          legacySubjectId: '4567',
        },
      ])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '4567',
      })

      await expect(alcoholMonitoringEquipmentHistoryPage.serviceInformationBanner).toBeVisible()
      await expect(alcoholMonitoringEquipmentHistoryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the search page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('5678', [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringEquipmentHistoryPage.backLink.click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderDetailsPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('1234', [
        {
          legacySubjectId: '1234',
        },
      ])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await alcoholMonitoringEquipmentHistoryPage.checkIsAccessible()
    })
  })

  test.describe('Equipment history timeline with no entries', () => {
    test('Displays a message when no results are found', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('0000', [])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '0000',
      })

      await expect(alcoholMonitoringEquipmentHistoryPage.equipmentHistory.element).not.toBeVisible()
      await expect(alcoholMonitoringEquipmentHistoryPage.equipmentHistory.noResultsHeading).toBeVisible()
      await expect(alcoholMonitoringEquipmentHistoryPage.equipmentHistory.noResultsMessage).toBeVisible()
    })
  })

  test.describe('Equipment history timeline with entries', () => {
    test('Displays an equipment history timeline with one entry', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('0987', [
        {
          legacySubjectId: '0987',
          deviceType: 'tag',
          deviceSerialNumber: '740',
          deviceAddressType: 'secondary',
          legFitting: 'right',
          deviceInstalledDateTime: '2001-01-01T01:10:10Z',
          deviceRemovedDateTime: '2002-02-02T02:20:20Z',
          hmuInstallDateTime: '2001-01-01T01:10:10Z',
          hmuRemovedDateTime: '2002-02-02T02:20:20Z',
        },
      ])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '0987',
      })

      const event = alcoholMonitoringEquipmentHistoryPage.equipmentHistory.getEntry(1)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('Equipment')
      await expect(event.date).toHaveText('1 Jan 2001 at 1:10am')

      const hmuSummaryCard = event.getDescription('Equipment')
      await expect(hmuSummaryCard).toHaveItem('Device type', 'tag')
      await expect(hmuSummaryCard).toHaveItem('Device serial number', '740')
      await expect(hmuSummaryCard).toHaveItem('Device address type', 'secondary')
      await expect(hmuSummaryCard).toHaveItem('Leg fitting', 'right')
      await expect(hmuSummaryCard).toHaveItem('Device installed date time', '1 January 2001 at 1:10am')
      await expect(hmuSummaryCard).toHaveItem('Device removed date time', '2 February 2002 at 2:20am')
      await expect(hmuSummaryCard).toHaveItem('HMU install date time', '1 January 2001 at 1:10am')
      await expect(hmuSummaryCard).toHaveItem('HMU removed date time', '2 February 2002 at 2:20am')
    })

    test('Displays an equipment history timeline with multiple entries', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('0987', [
        {
          legacySubjectId: '0987',
          deviceType: 'tag',
          deviceSerialNumber: '740',
          deviceAddressType: 'secondary',
          legFitting: 'right',
          deviceInstalledDateTime: '2001-01-01T01:10:10Z',
          deviceRemovedDateTime: '2002-02-02T02:20:20Z',
          hmuInstallDateTime: '2001-01-01T01:10:10Z',
          hmuRemovedDateTime: '2002-02-02T02:20:20Z',
        },
        {
          legacySubjectId: '0987-2',
          deviceType: 'tag',
          deviceSerialNumber: '740',
          deviceAddressType: 'secondary',
          legFitting: 'right',
          deviceInstalledDateTime: '2001-01-01T01:10:00Z',
          deviceRemovedDateTime: '2002-02-02T02:20:20Z',
          hmuInstallDateTime: '2001-01-01T01:10:10Z',
          hmuRemovedDateTime: '2002-02-02T02:20:20Z',
        },
      ])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '0987',
      })

      const event = alcoholMonitoringEquipmentHistoryPage.equipmentHistory.getEntry(2)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('Equipment')
      await expect(event.date).toHaveText('1 Jan 2001 at 1:10am')

      const hmuSummaryCard = event.getDescription('Equipment')
      await expect(hmuSummaryCard).toHaveItem('Device type', 'tag')
      await expect(hmuSummaryCard).toHaveItem('Device serial number', '740')
      await expect(hmuSummaryCard).toHaveItem('Device address type', 'secondary')
      await expect(hmuSummaryCard).toHaveItem('Leg fitting', 'right')
      await expect(hmuSummaryCard).toHaveItem('Device installed date time', '1 January 2001 at 1:10am')
      await expect(hmuSummaryCard).toHaveItem('Device removed date time', '2 February 2002 at 2:20am')
      await expect(hmuSummaryCard).toHaveItem('HMU install date time', '1 January 2001 at 1:10am')
      await expect(hmuSummaryCard).toHaveItem('HMU removed date time', '2 February 2002 at 2:20am')
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test('Navigates to the order summary page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('5678', [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringEquipmentHistoryPage.subNavigationLink('Summary').click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderSummaryPage, page)
    })

    test('Navigates to the order details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('5678', [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringEquipmentHistoryPage.subNavigationLink('Details').click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderDetailsPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('5678', [
        {
          legacySubjectId: '5678',
        },
      ])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringEquipmentHistoryPage.subNavigationLink('Equipment').click()

      await AppPage.verifyOnPage(AlcoholMonitoringEquipmentHistoryPage, page)
    })

    test('Navigates to the service details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('5678', [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockAlcoholMonitoringApi.stubGetServiceDetails('5678', [
        {
          legacySubjectId: '5678',
          serviceStartDate: '2001-01-01T00:00:00Z',
          serviceEndDate: '2002-02-02T00:00:00Z',
          serviceAddress: 'service address',
          equipmentStartDate: '2003-03-03T00:00:00Z',
          equipmentEndDate: '2004-04-04T00:00:00Z',
          hmuSerialNumber: 'hmu-01',
          deviceSerialNumber: 'device-01',
        },
      ])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringEquipmentHistoryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(AlcoholMonitoringServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('5678', [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockAlcoholMonitoringApi.stubGetVisitDetails('5678', [
        {
          legacySubjectId: '5678',
          actualWorkStartDateTime: '2024-06-01T09:00:00Z',
        },
      ])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringEquipmentHistoryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(AlcoholMonitoringVisitHistoryPage, page)
    })

    test('Navigates to the event history page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('5678', [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockAlcoholMonitoringApi.stubGetViolationEvents('5678', [
        {
          legacySubjectId: '5678',
          type: 'VIOLATION',
          dateTime: '2024-06-01T09:00:00Z',
          details: {},
        },
      ])
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('5678', [
        {
          legacySubjectId: '5678',
          type: 'INCIDENT',
          dateTime: '2024-06-01T09:00:00Z',
          details: {},
        },
      ])
      await mockAlcoholMonitoringApi.stubGetContactEvents('5678', [
        {
          legacySubjectId: '5678',
          type: 'CONTACT',
          dateTime: '2024-06-01T09:00:00Z',
          details: {},
        },
      ])

      const alcoholMonitoringEquipmentHistoryPage = await AppPage.visit(AlcoholMonitoringEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringEquipmentHistoryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(AlcoholMonitoringEventHistoryPage, page)
    })
  })
})
