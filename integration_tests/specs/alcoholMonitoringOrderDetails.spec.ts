import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'

import mockAlcoholMonitoringApi from '../mockApis/alcoholMonitoringDatastoreApi'

import AppPage from '../pages/appPage'
import AlcoholMonitoringOrderSummaryPage from '../pages/alcoholMonitoringOrderSummary'
import AlcoholMonitoringOrderDetailsPage from '../pages/alcoholMonitoringOrderDetails'
import AlcoholMonitoringEquipmentHistoryPage from '../pages/alcoholMonitoringEquipmentHistory'
import AlcoholMonitoringServiceHistoryPage from '../pages/alcoholMonitoringServiceHistory'
import AlcoholMonitoringVisitHistoryPage from '../pages/alcoholMonitoringVisitHistory'
import AlcoholMonitoringEventHistoryPage from '../pages/alcoholMonitoringEventHistory'

test.describe('AlcoholMonitoring order details', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('2345', {
        legacySubjectId: '2345',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringOrderSummaryPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '2345',
      })

      await expect(alcoholMonitoringOrderSummaryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('3456', {
        legacySubjectId: '3456',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringOrderSummaryPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '3456',
      })

      await expect(alcoholMonitoringOrderSummaryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('4567', {
        legacySubjectId: '4567',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringOrderSummaryPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '4567',
      })

      await expect(alcoholMonitoringOrderSummaryPage.serviceInformationBanner).toBeVisible()
      await expect(alcoholMonitoringOrderSummaryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the search page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringOrderSummaryPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringOrderSummaryPage.backLink.click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderSummaryPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('1234', {
        legacySubjectId: '1234',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringOrderSummaryPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '1234',
      })

      await alcoholMonitoringOrderSummaryPage.checkIsAccessible()
    })
  })

  test.describe('Device wearer information details', () => {
    test('Displays all details of the device wearer', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('0987', {
        legacySubjectId: '0987',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        alias: 'an old tv show',
        dateOfBirth: '1950-01-01',
        sex: 'puppy',
        address1: 'a13 Tenth Street',
        address2: 'Hiveton',
        address3: 'Oxbury',
        postcode: '7AN 8XD',
        orderStartDate: '2010-01-01',
        orderEndDate: '2030-01-01',
      })

      const alcoholMonitoringOrderDetailsPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '0987',
      })

      await expect(alcoholMonitoringOrderDetailsPage.deviceWearer).toHaveItem('Legacy Subject ID', '0987')
      await expect(alcoholMonitoringOrderDetailsPage.deviceWearer).toHaveItem('First name', 'Testopher')
      await expect(alcoholMonitoringOrderDetailsPage.deviceWearer).toHaveItem('Last name', 'Fakesmith')
      await expect(alcoholMonitoringOrderDetailsPage.deviceWearer).toHaveItem('Alias', 'an old tv show')
      await expect(alcoholMonitoringOrderDetailsPage.deviceWearer).toHaveItem('Date of birth', '1 January 1950')
      await expect(alcoholMonitoringOrderDetailsPage.deviceWearer).toHaveItem('Legacy sex', 'puppy')
      await expect(alcoholMonitoringOrderDetailsPage.deviceWearer).toHaveItem(
        'Primary address',
        'a13 Tenth Street\nHiveton\nOxbury\n7AN 8XD',
      )
    })
  })

  test.describe('Order information details', () => {
    test('Displays all details of the order', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('0987', {
        legacySubjectId: '0987',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        orderStartDate: '2010-01-01',
        orderEndDate: '2030-01-01',
      })

      const alcoholMonitoringOrderDetailsPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '0987',
      })

      await expect(alcoholMonitoringOrderDetailsPage.order).toHaveItems([
        ['Order start date', '1 January 2010'],
        ['Order end date', '1 January 2030'],
      ])
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test('Navigates to the order summary page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      const alcoholMonitoringOrderSummaryPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringOrderSummaryPage.subNavigationLink('Summary').click()

      await AppPage.verifyOnPage(AlcoholMonitoringOrderSummaryPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      await mockAlcoholMonitoringApi.stubGetEquipmentDetails('5678', [
        {
          legacySubjectId: '5678',
        },
      ])

      const alcoholMonitoringOrderSummaryPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringOrderSummaryPage.subNavigationLink('Equipment').click()

      await AppPage.verifyOnPage(AlcoholMonitoringEquipmentHistoryPage, page)
    })

    test('Navigates to the service details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      await mockAlcoholMonitoringApi.stubGetServiceDetails('5678', [
        {
          legacySubjectId: '5678',
        },
      ])

      const alcoholMonitoringOrderSummaryPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringOrderSummaryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(AlcoholMonitoringServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      await mockAlcoholMonitoringApi.stubGetVisitDetails('5678', [
        {
          legacySubjectId: '5678',
          actualWorkStartDateTime: '2024-06-01T09:00:00',
        },
      ])

      const alcoholMonitoringOrderSummaryPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringOrderSummaryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(AlcoholMonitoringVisitHistoryPage, page)
    })

    test('Navigates to the event history page', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubGetOrderDetails('5678', {
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
      })

      await mockAlcoholMonitoringApi.stubGetViolationEvents('5678', [
        {
          legacySubjectId: '5678',
          type: 'VIOLATION',
          dateTime: '2024-06-01T09:00:00',
          details: {},
        },
      ])
      await mockAlcoholMonitoringApi.stubGetIncidentEvents('5678', [
        {
          legacySubjectId: '5678',
          type: 'INCIDENT',
          dateTime: '2024-06-01T09:00:00',
          details: {},
        },
      ])
      await mockAlcoholMonitoringApi.stubGetContactEvents('5678', [
        {
          legacySubjectId: '5678',
          type: 'CONTACT',
          dateTime: '2024-06-01T09:00:00',
          details: {},
        },
      ])

      const alcoholMonitoringOrderSummaryPage = await AppPage.visit(AlcoholMonitoringOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await alcoholMonitoringOrderSummaryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(AlcoholMonitoringEventHistoryPage, page)
    })
  })
})
