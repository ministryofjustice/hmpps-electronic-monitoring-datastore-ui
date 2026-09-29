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

test.describe('Integrity equipment history', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('2345', false, [
        {
          legacySubjectId: '2345',
        },
      ])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '2345',
      })

      await expect(integrityEquipmentHistoryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('3456', false, [
        {
          legacySubjectId: '2345',
        },
      ])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '3456',
      })

      await expect(integrityEquipmentHistoryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('4567', false, [
        {
          legacySubjectId: '2345',
        },
      ])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '4567',
      })

      await expect(integrityEquipmentHistoryPage.serviceInformationBanner).toBeVisible()
      await expect(integrityEquipmentHistoryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the search page', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('5678', false, [
        {
          legacySubjectId: '2345',
        },
      ])

      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityEquipmentHistoryPage.backLink.click()

      await AppPage.verifyOnPage(IntegrityOrderDetailsPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('1234', false, [
        {
          legacySubjectId: '1234',
        },
      ])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '1234',
      })

      await integrityEquipmentHistoryPage.checkIsAccessible()
    })
  })

  test.describe('Equipment history timeline with no entries', () => {
    test('Displays a message when no results are found', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('0000', false, [])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '0000',
      })

      await expect(integrityEquipmentHistoryPage.equipmentHistory.element).not.toBeVisible()
      await expect(integrityEquipmentHistoryPage.equipmentHistory.noResultsHeading).toBeVisible()
      await expect(integrityEquipmentHistoryPage.equipmentHistory.noResultsMessage).toBeVisible()
    })
  })

  test.describe('Equipment history timeline with entries', () => {
    test('Displays an equipment history timeline with one entry', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('0987', false, [
        {
          legacySubjectId: '0987',
          pid: {
            id: '1111',
            equipmentCategoryDescription: 'Some PID description',
            installedDateTime: '2024-07-01T12:00:00Z',
            removedDateTime: '2024-08-10T12:00:00Z',
          },
          hmu: {
            id: '2222',
            equipmentCategoryDescription: 'Some HMU description',
            installedDateTime: '2024-09-01T12:00:00Z',
            removedDateTime: '2024-10-10T12:00:00Z',
          },
        },
      ])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '0987',
      })

      const event = integrityEquipmentHistoryPage.equipmentHistory.getEntry(1)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('Equipment')
      await expect(event.date).toHaveText('1 Jul 2024 at 1pm')

      const hmuSummaryCard = event.getDescription('HMU')
      await expect(hmuSummaryCard).toHaveItem('Device ID', '2222')
      await expect(hmuSummaryCard).toHaveItem('Equipment category description', 'Some HMU description')
      await expect(hmuSummaryCard).toHaveItem('Install date', '1 September 2024')
      await expect(hmuSummaryCard).toHaveItem('Install time', '1pm')
      await expect(hmuSummaryCard).toHaveItem('Uninstall date', '10 October 2024')
      await expect(hmuSummaryCard).toHaveItem('Uninstall time', '1pm')

      const pidSummaryCard = event.getDescription('PID')
      await expect(pidSummaryCard).toHaveItem('Device ID', '1111')
      await expect(pidSummaryCard).toHaveItem('Equipment category description', 'Some PID description')
      await expect(pidSummaryCard).toHaveItem('Install date', '1 July 2024')
      await expect(pidSummaryCard).toHaveItem('Install time', '1pm')
      await expect(pidSummaryCard).toHaveItem('Uninstall date', '10 August 2024')
      await expect(pidSummaryCard).toHaveItem('Uninstall time', '1pm')
    })

    test('Displays an equipment history timeline with multiple entries', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('0987', false, [
        {
          legacySubjectId: '0987',
          pid: {
            id: '1111',
            equipmentCategoryDescription: 'Some PID description',
            installedDateTime: '2024-07-01T12:00:00Z',
            removedDateTime: '2024-08-10T12:00:00Z',
          },
          hmu: {
            id: '2222',
            equipmentCategoryDescription: 'Some HMU description',
            installedDateTime: '2024-09-01T12:00:00Z',
            removedDateTime: '2024-10-10T12:00:00Z',
          },
        },
        {
          legacySubjectId: '0987-2',
          pid: {
            id: '1111-2',
            equipmentCategoryDescription: 'Some PID description',
            installedDateTime: '2024-07-02T12:00:00Z',
            removedDateTime: '2024-08-11T12:00:00Z',
          },
          hmu: {
            id: '2222-2',
            equipmentCategoryDescription: 'Some HMU description',
            installedDateTime: '2024-09-02T12:00:00Z',
            removedDateTime: '2024-10-11T12:00:00Z',
          },
        },
      ])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '0987',
      })

      const event = integrityEquipmentHistoryPage.equipmentHistory.getEntry(2)
      await expect(event.element).toBeVisible()
      await expect(event.title).toHaveText('Equipment')
      await expect(event.date).toHaveText('2 Jul 2024 at 1pm')

      const hmuSummaryCard = event.getDescription('HMU')
      await expect(hmuSummaryCard).toHaveItem('Device ID', '2222-2')
      await expect(hmuSummaryCard).toHaveItem('Equipment category description', 'Some HMU description')
      await expect(hmuSummaryCard).toHaveItem('Install date', '2 September 2024')
      await expect(hmuSummaryCard).toHaveItem('Install time', '1pm')
      await expect(hmuSummaryCard).toHaveItem('Uninstall date', '11 October 2024')
      await expect(hmuSummaryCard).toHaveItem('Uninstall time', '1pm')

      const pidSummaryCard = event.getDescription('PID')
      await expect(pidSummaryCard).toHaveItem('Device ID', '1111-2')
      await expect(pidSummaryCard).toHaveItem('Equipment category description', 'Some PID description')
      await expect(pidSummaryCard).toHaveItem('Install date', '2 July 2024')
      await expect(pidSummaryCard).toHaveItem('Install time', '1pm')
      await expect(pidSummaryCard).toHaveItem('Uninstall date', '11 August 2024')
      await expect(pidSummaryCard).toHaveItem('Uninstall time', '1pm')
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test('Navigates to the order summary page', async ({ page }) => {
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

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityEquipmentHistoryPage.subNavigationLink('Summary').click()

      await AppPage.verifyOnPage(IntegrityOrderSummaryPage, page)
    })

    test('Navigates to the order details page', async ({ page }) => {
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

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityEquipmentHistoryPage.subNavigationLink('Details').click()

      await AppPage.verifyOnPage(IntegrityOrderDetailsPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('5678', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityEquipmentHistoryPage.subNavigationLink('Equipment').click()

      await AppPage.verifyOnPage(IntegrityEquipmentHistoryPage, page)
    })

    test('Navigates to the service details page', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('5678', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockIntegrityApi.stubGetServiceDetails('5678', false, [
        {
          legacySubjectId: '5678',
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

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityEquipmentHistoryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(IntegrityServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('5678', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockIntegrityApi.stubGetVisitDetails('5678', false, [
        {
          legacySubjectId: '5678',
          actualWorkStartDateTime: '2024-06-01T09:00:00',
        },
      ])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityEquipmentHistoryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(IntegrityVisitHistoryPage, page)
    })

    test('Navigates to the suspension of visits page', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('5678', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockIntegrityApi.stubGetSuspensionOfVisits('5678', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityEquipmentHistoryPage.subNavigationLink('Suspension of visits').click()

      await AppPage.verifyOnPage(IntegritySuspensionOfVisitsHistoryPage, page)
    })

    test('Navigates to the event history page', async ({ page }) => {
      await mockIntegrityApi.stubGetEquipmentDetails('5678', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      await mockIntegrityApi.stubGetViolationEvents('5678', false, [
        {
          legacySubjectId: '5678',
          type: 'VIOLATION',
          dateTime: '2024-06-01T09:00:00',
          details: {},
        },
      ])
      await mockIntegrityApi.stubGetIncidentEvents('5678', false, [
        {
          legacySubjectId: '5678',
          type: 'INCIDENT',
          dateTime: '2024-06-01T09:00:00',
          details: {},
        },
      ])
      await mockIntegrityApi.stubGetMonitoringEvents('5678', false, [
        {
          legacySubjectId: '5678',
          type: 'MONITORING',
          dateTime: '2024-06-01T09:00:00',
          details: {},
        },
      ])
      await mockIntegrityApi.stubGetContactEvents('5678', false, [
        {
          legacySubjectId: '5678',
          type: 'CONTACT',
          dateTime: '2024-06-01T09:00:00',
          details: {},
        },
      ])

      const integrityEquipmentHistoryPage = await AppPage.visit(IntegrityEquipmentHistoryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityEquipmentHistoryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(IntegrityEventHistoryPage, page)
    })
  })
})
