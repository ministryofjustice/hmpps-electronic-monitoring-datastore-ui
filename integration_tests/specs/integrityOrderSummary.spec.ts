import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'

import mockIntegrityApi from '../mockApis/integrityDatastoreApi'

import AppPage from '../pages/appPage'
import SearchPage from '../pages/searchPage'
import IntegrityOrderSummaryPage from '../pages/integrityOrderSummary'

test.describe('Integrity order search results', () => {
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

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderSummaryPage, page, {
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

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderSummaryPage, page, {
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

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderSummaryPage, page, {
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

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderSummaryPage, page, {
        legacySubjectId: '5678',
      })

      await integrityOrderSummaryPage.backLink.click()

      await AppPage.verifyOnPage(SearchPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('1234', false, {
        specials: 'no',
        legacySubjectId: '1234',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        offenceRisk: false,
      })

      const integrityOrderSummaryPage = await AppPage.visit(IntegrityOrderSummaryPage, page, {
        legacySubjectId: '1234',
      })

      await integrityOrderSummaryPage.checkIsAccessible()
    })
  })

  test.describe('Order information details', () => {
    test('Display a summary of the order', async ({ page }) => {
      await mockIntegrityApi.stubGetOrderDetails('0987', false, {
        specials: 'no',
        legacySubjectId: '0987',
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        alias: 'an old tv show',
        dateOfBirth: '1950-01-01',
        primaryAddressLine1: '123 Fourth Street',
        primaryAddressLine2: 'Fiveton',
        primaryAddressLine3: 'Sixbury',
        primaryAddressPostCode: '7AB 8CD',
        orderStartDate: '2010-01-01',
        orderEndDate: '2030-01-01',
        offenceRisk: false,
      })

      const summaryPage = await AppPage.visit(IntegrityOrderSummaryPage, page, { legacySubjectId: '0987' })

      await expect(summaryPage.summaryDetails).toHaveItems([
        ['Specials', 'no'],
        ['Legacy Subject ID', '0987'],
        ['Name', 'Testopher Fakesmith'],
        ['Alias', 'an old tv show'],
        ['Date of birth', '1 January 1950'],
        ['Primary address', '123 Fourth Street\nFiveton\nSixbury\n7AB 8CD'],
        ['Order start date', '1 January 2010'],
        ['Order end date', '1 January 2030'],
      ])
    })
  })
})
