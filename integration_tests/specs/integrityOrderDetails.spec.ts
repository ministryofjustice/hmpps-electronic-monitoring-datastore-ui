import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'

import mockIntegrityApi from '../mockApis/integrityDatastoreApi'

import AppPage from '../pages/appPage'
import SearchPage from '../pages/searchPage'
import IntegrityOrderSummaryPage from '../pages/integrityOrderSummary'
import IntegrityOrderDetailsPage from '../pages/integrityOrderDetails'
import IntegrityEquipmentHistoryPage from '../pages/integrityEquipmentHistory'
import IntegrityServiceHistoryPage from '../pages/integrityServiceHistory'
import IntegrityVisitHistoryPage from '../pages/integrityVisitHistory'
import IntegritySuspensionOfVisitsHistoryPage from '../pages/integritySuspensionOfVisitsHistory'
import IntegrityEventHistoryPage from '../pages/integrityEventHistory'

test.describe('Integrity order details', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' }) // , roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] }
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('2345', false, {
        specials: 'no',
        legacySubjectId: '2345',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '2345',
      })

      await expect(integrityOrderSummaryPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('3456', false, {
        specials: 'no',
        legacySubjectId: '3456',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '3456',
      })

      await expect(integrityOrderSummaryPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('4567', false, {
        specials: 'no',
        legacySubjectId: '4567',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '4567',
      })

      await expect(integrityOrderSummaryPage.serviceInformationBanner).toBeVisible()
      await expect(integrityOrderSummaryPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the search page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await integrityOrderSummaryPage.backLink.click()

      await AppPage.verifyOnPage(IntegrityOrderSummaryPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('1234', false, {
        specials: 'no',
        legacySubjectId: '1234',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '1234',
      })

      await integrityOrderSummaryPage.checkIsAccessible()
    })
  })

  test.describe('Device wearer information details', () => {
    test('Displays all details of the device wearer', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('0987', false, {
        specials: 'no',
        legacySubjectId: '0987',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        alias: 'an old tv show',
        dateOfBirth: '1950-01-01',
        adultOrChild: 'adult',
        sex: 'puppy',
        contact: 'only when neccessary',
        primaryAddressLine1: 'a13 Tenth Street',
        primaryAddressLine2: 'Hiveton',
        primaryAddressLine3: 'Oxbury',
        primaryAddressPostCode: '7AN 8XD',
        orderStartDate: '2010-01-01',
        orderEndDate: '2030-01-01',
        offenceRisk: false,
      })

      const integrityOrderDetailsPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '0987',
      })

      await expect(integrityOrderDetailsPage.deviceWearer).toHaveItems([
        ['Specials', 'no'],
        ['Legacy Subject ID', '0987'],
        ['First name', 'Testopher'],
        ['Last name', 'Fakesmith'],
        ['Alias', 'an old tv show'],
        ['Date of birth', '1 January 1950'],
        ['Adult/child', 'adult'],
        ['Legacy sex', 'puppy'],
        ['Contact', 'only when neccessary'],
        ['Primary address', 'a13 Tenth Street\nHiveton\nOxbury\n7AN 8XD'],
      ])
    })
  })

  test.describe('Order information details', () => {
    test('Displays all details of the order', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('0987', false, {
        specials: 'no',
        legacySubjectId: '0987',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        orderStartDate: '2010-01-01',
        orderEndDate: '2030-01-01',
        offenceRisk: false,
      })

      const integrityOrderDetailsPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '0987',
      })

      await expect(integrityOrderDetailsPage.order).toHaveItems([
        ['Order start date', '1 January 2010'],
        ['Order end date', '1 January 2030'],
      ])
    })
  })

  test.describe('Navigation between order sub-pages', () => {
    test('Navigates to the order summary page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await integrityOrderSummaryPage.subNavigationLink('Summary').click()

      await AppPage.verifyOnPage(IntegrityOrderSummaryPage, page)
    })

    test('Navigates to the equipment details page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      await mockIntegrityApi.stubGetEquipmentDetails('5678', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await integrityOrderSummaryPage.subNavigationLink('Equipment').click()

      await AppPage.verifyOnPage(IntegrityEquipmentHistoryPage, page)
    })

    test('Navigates to the service details page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

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

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await integrityOrderSummaryPage.subNavigationLink('Services').click()

      await AppPage.verifyOnPage(IntegrityServiceHistoryPage, page)
    })

    test('Navigates to the visit details page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      await mockIntegrityApi.stubGetVisitDetails('5678', false, [
        {
          legacySubjectId: '5678',
          actualWorkStartDateTime: '2024-06-01T09:00:00',
        },
      ])

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await integrityOrderSummaryPage.subNavigationLink('Visits').click()

      await AppPage.verifyOnPage(IntegrityVisitHistoryPage, page)
    })

    test('Navigates to the suspension of visits page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      await mockIntegrityApi.stubGetSuspensionOfVisits('5678', false, [
        {
          legacySubjectId: '5678',
        },
      ])

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await integrityOrderSummaryPage.subNavigationLink('Suspension of visits').click()

      await AppPage.verifyOnPage(IntegritySuspensionOfVisitsHistoryPage, page)
    })

    test('Navigates to the event history page', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('5678', false, {
        specials: 'no',
        legacySubjectId: '5678',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

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

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderDetailsPage, page, {
        legacySubjectId: '5678',
      })

      await integrityOrderSummaryPage.subNavigationLink('Events').click()

      await AppPage.verifyOnPage(IntegrityEventHistoryPage, page)
    })
  })
})

/*
  ; (() => {
    test.beforeEach(({ page }) => {
      login(page, { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

      mockIntegrityApi.stubGetOrderDetails(
        '5678',
        false,
        {
          specials: 'no',
          legacySubjectId: '5678',
          primaryAddressLine1: 'Address line 1',
          primaryAddressLine2: 'Address line 2',
          primaryAddressLine3: 'Address line 3',
          primaryAddressPostCode: 'PostCode',
          offenceRisk: false,
        },
      )
    })

    test.describe('Device wearer details', () => {

      test('Includes expected row headers', () => {
        const orderDetailsPage = Page.visit(OrderDetailsPage, { legacySubjectId })
        orderDetailsPage.deviceWearerDetails.within($summary => {
          cy.wrap($summary).getBySummaryListKey('Specials').contains('no')
          cy.wrap($summary).getBySummaryListKey('Legacy subject ID').contains(legacySubjectId)

          cy.wrap($summary).getBySummaryListKey('First name').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Last name').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Alias').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Date of birth').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Adult/child').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Legacy sex').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Contact').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Primary address').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Phone/mobile number').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('PPO').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('MAPPA').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Technical bail').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Manual risk').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Offence risk').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('PostCode risk').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('False limb risk').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Migrated risk').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Range risk').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Report risk').should('be.visible')
        })
      })

      test('Displays primary address values in a single cell', () => {
        const orderDetailsPage = Page.visit(OrderDetailsPage, { legacySubjectId })
        orderDetailsPage.deviceWearerDetails
          .getBySummaryListKey('Primary address')
          .contains('Address line 1Address line 2Address line 3PostCode')
      })
    })

    test.describe('Order details', () => {
      test('Renders', () => {
        const orderDetailsPage = Page.visit(OrderDetailsPage, { legacySubjectId })
        orderDetailsPage.orderDetails.should('be.visible')
      })

      test('Includes expected row headers', () => {
        const orderDetailsPage = Page.visit(OrderDetailsPage, { legacySubjectId })
        orderDetailsPage.orderDetails.within($summary => {
          cy.wrap($summary).getBySummaryListKey('Order start date').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Order end date').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Order type').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Order type description').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Order type detail').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Wearing wrist PID').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Notifying organisation name').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Responsible organisation').should('be.visible')
          cy.wrap($summary).getBySummaryListKey('Responsible organisation region').should('be.visible')
        })
      })
    })
  }
*/
