import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'

import mockIntegrityApi from '../mockApis/integrityDatastoreApi'
import mockAlcoholMonitoringApi from '../mockApis/alcoholMonitoringDatastoreApi'

import AppPage from '../pages/appPage'
import StartPage from '../pages/startPage'
import SearchPage from '../pages/searchPage'
import IntegritySearchResultsPage from '../pages/integritySearchResults'
import AlcoholMonitoringSearchResultsPage from '../pages/alcoholMonitoringSearchResults'

test.describe('Order search', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' })
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('General page content', () => {
    test('can see their user name', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage.usersName).toHaveText('M. Tester')
    })

    test('Can see the phase banner', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage.phaseBanner).toHaveText('DEV')
    })

    test('Can see service information', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage.serviceInformation).toBeVisible()
      await expect(searchPage.serviceInformation).toContainText(
        'This service gives you access to all order data that was held by Capita and G4S',
      )
    })

    test('Can see order search form', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage).toHaveForm()
    })

    test('Can go back to the start page', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.goBack()
      await AppPage.verifyOnPage(StartPage, page)
    })

    test('Is accessible', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await searchPage.checkIsAccessible()
    })
  })

  test.describe('Order search form', () => {
    test('Displays Order type field', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage.form.orderType).toBeVisibleWithinForm()
      await expect(searchPage.form.orderType).not.toBeDisabledWithinForm()
    })

    test('Displays Legacy subject ID field', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage.form.legacySubjectId).toBeVisibleWithinForm()
      await expect(searchPage.form.legacySubjectId).not.toBeDisabledWithinForm()
    })

    test('Displays First name field', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage.form.firstName).toBeVisibleWithinForm()
      await expect(searchPage.form.firstName).not.toBeDisabledWithinForm()
    })

    test('Displays Last name field', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage.form.lastName).toBeVisibleWithinForm()
      await expect(searchPage.form.lastName).not.toBeDisabledWithinForm()
    })

    test('Displays Date of birth fields', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage.form.dateOfBirth).toBeVisibleWithinForm()
      await expect(searchPage.form.dateOfBirth).not.toBeDisabledWithinForm()
    })

    test('Displays Alias field', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage.form.alias).toBeVisibleWithinForm()
      await expect(searchPage.form.alias).not.toBeDisabledWithinForm()
    })

    test('Displays Search button', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)
      await expect(searchPage.form.searchButton).toBeVisible()
    })
  })

  test.describe('Error summary', () => {
    test('Displays empty form validation error message', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('You must enter a value into at least one search field')
    })

    test('Displays first name validation error messages', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.form.firstName.fill('John123')
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('First name must contain letters only')

      await expect(searchPage.form.firstName).toHaveValidationErrorText('First name must contain letters only')
      await expect(searchPage.form.lastName).not.toHaveValidationError()
      await expect(searchPage.form.alias).not.toHaveValidationError()
    })

    test('Displays last name validation error messages', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.form.lastName.fill('Smith123')
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('Last name must contain letters only')

      await expect(searchPage.form.firstName).not.toHaveValidationError()
      await expect(searchPage.form.lastName).toHaveValidationErrorText('Last name must contain letters only')
      await expect(searchPage.form.alias).not.toHaveValidationError()
    })

    test('Displays date of birth day validation error messages', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.form.dateOfBirth.dayField.fill('Monday')
      await searchPage.form.dateOfBirth.monthField.fill('01')
      await searchPage.form.dateOfBirth.fillYear('2001')
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('Please enter a real date. For example, 24 10 2020')

      await expect(searchPage.form.firstName).not.toHaveValidationError()
      await expect(searchPage.form.dateOfBirth).toHaveValidationErrorText(
        'Please enter a real date. For example, 24 10 2020',
      )
      await expect(searchPage.form.alias).not.toHaveValidationError()
    })

    test('Displays alias validation error messages', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.form.alias.fill('John Smith-123')
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('Alias must contain letters and spaces only')

      await expect(searchPage.form.firstName).not.toHaveValidationError()
      await expect(searchPage.form.lastName).not.toHaveValidationError()
      await expect(searchPage.form.alias).toHaveValidationErrorText('Alias must contain letters and spaces only')
    })

    test('Displays multiple validation error messages', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.form.fill({
        orderType: 'Integrity',
        legacySubjectId: 'B3@sT!',
        firstName: 'John123',
        lastName: 'Smith123',
        alias: 'John Smith-123',
        dateOfBirth: { day: '1', month: 'October', year: '2020' },
      })
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('First name must contain letters only')
      await expect(searchPage).toHaveErrorSummaryText('Last name must contain letters only')
      await expect(searchPage).toHaveErrorSummaryText('Alias must contain letters and spaces only')
      await expect(searchPage).toHaveErrorSummaryText('Please enter a real date. For example, 24 10 2020')

      await expect(searchPage.form.firstName).toHaveValidationErrorText('First name must contain letters only')
      await expect(searchPage.form.lastName).toHaveValidationErrorText('Last name must contain letters only')
      await expect(searchPage.form.alias).toHaveValidationErrorText('Alias must contain letters and spaces only')
      await expect(searchPage.form.dateOfBirth).toHaveValidationErrorText(
        'Please enter a real date. For example, 24 10 2020',
      )
    })

    test('Validation error messages are accessible', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.form.fill({
        orderType: 'Integrity',
        legacySubjectId: 'B3@sT!',
        firstName: 'John123',
        lastName: 'Smith123',
        alias: 'John Smith-123',
        dateOfBirth: { day: '1', month: 'October', year: '2020' },
      })
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('First name must contain letters only')
      await expect(searchPage).toHaveErrorSummaryText('Last name must contain letters only')
      await expect(searchPage).toHaveErrorSummaryText('Alias must contain letters and spaces only')
      await expect(searchPage).toHaveErrorSummaryText('Please enter a real date. For example, 24 10 2020')

      await expect(searchPage.form.firstName).toHaveValidationErrorText('First name must contain letters only')
      await expect(searchPage.form.lastName).toHaveValidationErrorText('Last name must contain letters only')
      await expect(searchPage.form.alias).toHaveValidationErrorText('Alias must contain letters and spaces only')
      await expect(searchPage.form.dateOfBirth).toHaveValidationErrorText(
        'Please enter a real date. For example, 24 10 2020',
      )

      await searchPage.checkIsAccessible()
    })
  })

  test.describe('Submitting an order search request', () => {
    test('Submits an integrity order search request successfully', async ({ page }) => {
      await mockIntegrityApi.stubPostOrderSearch('1234566', false)
      await mockIntegrityApi.stubGetSearchResults('1234566', '0988765', false, [])

      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.form.orderType.check('Integrity')
      await searchPage.form.firstName.fill('John')
      await searchPage.form.lastName.fill('Smith')
      await searchPage.form.alias.fill('Johnny')
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(IntegritySearchResultsPage, page)
    })

    test('Submits an alcohol monitoring order search request successfully', async ({ page }) => {
      await mockAlcoholMonitoringApi.stubPostOrderSearch('1234566')
      await mockAlcoholMonitoringApi.stubGetSearchResults('1234566', '0988765', [])

      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.form.orderType.check('Alcohol monitoring data only')
      await searchPage.form.firstName.fill('Robert')
      await searchPage.form.lastName.fill('Marshall')
      await searchPage.form.alias.fill('Bobby')
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(AlcoholMonitoringSearchResultsPage, page)
    })
  })
})
