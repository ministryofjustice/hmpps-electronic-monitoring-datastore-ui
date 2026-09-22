import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'

import alcoholMonitoringDatastoreApi from '../mockApis/alcoholMonitoringDatastoreApi'

import AppPage from '../pages/appPage'
import SearchPage from '../pages/searchPage'
import AlcoholMonitoringSearchResultsPage from '../pages/alcoholMonitoringSearchResults'

test.describe('Alcohol monitoring order search results', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' })
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      await alcoholMonitoringDatastoreApi.stubGetSearchResults('1111111', '0988765', [])

      const integritySearchResultsPage = await AppPage.visit(
        AlcoholMonitoringSearchResultsPage,
        page,
        {},
        { search_id: '1111111' },
      )

      await expect(integritySearchResultsPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      await alcoholMonitoringDatastoreApi.stubGetSearchResults('2222222', '0988765', [])

      const integritySearchResultsPage = await AppPage.visit(
        AlcoholMonitoringSearchResultsPage,
        page,
        {},
        { search_id: '2222222' },
      )

      await expect(integritySearchResultsPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      await alcoholMonitoringDatastoreApi.stubGetSearchResults('3333333', '0988765', [])

      const integritySearchResultsPage = await AppPage.visit(
        AlcoholMonitoringSearchResultsPage,
        page,
        {},
        { search_id: '3333333' },
      )

      await expect(integritySearchResultsPage.serviceInformationBanner).toBeVisible()
      await expect(integritySearchResultsPage.serviceInformationBanner).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can go back to the search page', async ({ page }) => {
      await alcoholMonitoringDatastoreApi.stubGetSearchResults('44444444', '0988765', [])

      const alcoholMonitoringSearchResultsPage = await AppPage.visit(
        AlcoholMonitoringSearchResultsPage,
        page,
        {},
        { search_id: '44444444' },
      )
      await alcoholMonitoringSearchResultsPage.backLink.click()

      await AppPage.verifyOnPage(SearchPage, page)
    })
  })

  test.describe('When no results are found', () => {
    test.beforeEach(async () => {
      await alcoholMonitoringDatastoreApi.stubGetSearchResults('5555555', '0988765', [])
    })

    test('Can see no order search results', async ({ page }) => {
      const integritySearchResultsPage = await AppPage.visit(
        AlcoholMonitoringSearchResultsPage,
        page,
        {},
        { search_id: '5555555' },
      )

      await expect(integritySearchResultsPage.noResults).toBeVisible()
      await expect(integritySearchResultsPage.noResults).toContainText('Sorry, no results were found for this search')
    })

    test('Can return to the search page', async ({ page }) => {
      const alcoholMonitoringSearchResultsPage = await AppPage.visit(
        AlcoholMonitoringSearchResultsPage,
        page,
        {},
        { search_id: '5555555' },
      )
      await alcoholMonitoringSearchResultsPage.returnToSearchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)
    })

    test('Is accessible', async ({ page }) => {
      const alcoholMonitoringSearchResultsPage = await AppPage.visit(
        AlcoholMonitoringSearchResultsPage,
        page,
        {},
        { search_id: '5555555' },
      )

      await alcoholMonitoringSearchResultsPage.checkIsAccessible()
    })
  })

  test.describe('When some results are found', () => {
    test.beforeEach(async () => {
      await alcoholMonitoringDatastoreApi.stubGetSearchResults('6666666', '0988765', [
        {
          legacySubjectId: '1234567',
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          legacySubjectId: '0987654',
          firstName: 'Bob',
          lastName: 'Flemm',
        },
      ])
    })

    test('Can see order search results', async ({ page }) => {
      const alcoholMonitoringSearchResultsPage = await AppPage.visit(
        AlcoholMonitoringSearchResultsPage,
        page,
        {},
        { search_id: '6666666' },
      )

      await expect(alcoholMonitoringSearchResultsPage.orderSearchResults).toBeVisible()
      await expect(alcoholMonitoringSearchResultsPage.orderSearchResults).toContainText('1234567 JOHN DOE')
      await expect(alcoholMonitoringSearchResultsPage.orderSearchResults).toContainText('0987654 BOB FLEMM')
    })

    test('Is accessible', async ({ page }) => {
      const alcoholMonitoringSearchResultsPage = await AppPage.visit(
        AlcoholMonitoringSearchResultsPage,
        page,
        {},
        { search_id: '6666666' },
      )

      await alcoholMonitoringSearchResultsPage.checkIsAccessible()
    })
  })
})
