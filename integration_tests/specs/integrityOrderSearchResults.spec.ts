import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'

import mockIntegrityApi from '../mockApis/integrityDatastoreApi'

import AppPage from '../pages/appPage'
import SearchPage from '../pages/searchPage'
import IntegritySearchResultsPage from '../pages/integritySearchResults'

test.describe('Integrity order search results', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' })
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await mockIntegrityApi.stubGetSearchResults('1111111', '0988765', false, [])

      const integritySearchResultsPage = await AppPage.visit(
        IntegritySearchResultsPage,
        page,
        {},
        { search_id: '1111111' },
      )

      await expect(integritySearchResultsPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await mockIntegrityApi.stubGetSearchResults('2222222', '0988765', false, [])

      const integritySearchResultsPage = await AppPage.visit(
        IntegritySearchResultsPage,
        page,
        {},
        { search_id: '2222222' },
      )

      await expect(integritySearchResultsPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await mockIntegrityApi.stubGetSearchResults('3333333', '0988765', false, [])

      const integritySearchResultsPage = await AppPage.visit(
        IntegritySearchResultsPage,
        page,
        {},
        { search_id: '3333333' },
      )

      await expect(integritySearchResultsPage.serviceInformation).toBeVisible()
      await expect(integritySearchResultsPage.serviceInformation).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can see no order search results', async ({ page }) => {
      await mockIntegrityApi.stubGetSearchResults('4444444', '0988765', false, [])

      const integritySearchResultsPage = await AppPage.visit(
        IntegritySearchResultsPage,
        page,
        {},
        { search_id: '4444444' },
      )

      await expect(integritySearchResultsPage.noResults).toBeVisible()
      await expect(integritySearchResultsPage.noResults).toContainText('Sorry, no results were found for this search')
    })

    test('Can see order search results', async ({ page }) => {
      await mockIntegrityApi.stubGetSearchResults('4444444', '0988765', false, [
        {
          specials: 'no',
          legacySubjectId: '1234567',
          firstName: 'John',
          lastName: 'Doe',
          offenceRisk: false,
        },
        {
          specials: 'no',
          legacySubjectId: '0987654',
          firstName: 'Bob',
          lastName: 'Flemm',
          offenceRisk: false,
        },
      ])

      const integritySearchResultsPage = await AppPage.visit(
        IntegritySearchResultsPage,
        page,
        {},
        { search_id: '4444444' },
      )

      await expect(integritySearchResultsPage.searchResults).toBeVisible()
      await expect(integritySearchResultsPage.searchResults).toContainText('1234567 JOHN DOE')
      await expect(integritySearchResultsPage.searchResults).toContainText('0987654 BOB FLEMM')
    })

    test('Can return to the search page', async ({ page }) => {
      await mockIntegrityApi.stubGetSearchResults('5555555', '0988765', false, [])

      const integritySearchResultsPage = await AppPage.visit(
        IntegritySearchResultsPage,
        page,
        {},
        { search_id: '5555555' },
      )
      await integritySearchResultsPage.returnToSearchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)
    })

    test('Can go back to the search page', async ({ page }) => {
      await mockIntegrityApi.stubGetSearchResults('5555555', '0988765', false, [])

      const integritySearchResultsPage = await AppPage.visit(
        IntegritySearchResultsPage,
        page,
        {},
        { search_id: '5555555' },
      )
      await integritySearchResultsPage.backLink.click()

      await AppPage.verifyOnPage(SearchPage, page)
    })

    test('Is accessible', async ({ page }) => {
      await mockIntegrityApi.stubGetSearchResults('6666666', '0988765', false, [])

      const integritySearchResultsPage = await AppPage.visit(
        IntegritySearchResultsPage,
        page,
        {},
        { search_id: '6666666' },
      )

      await integritySearchResultsPage.checkIsAccessible()
    })
  })
})
