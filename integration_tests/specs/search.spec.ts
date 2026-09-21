import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'

import AppPage from '../pages/appPage'
import StartPage from '../pages/startPage'
import SearchPage from '../pages/searchPage'

test.describe('Search', () => {
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
    test('Should display empty form validation error message', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('You must enter a value into at least one search field')
    })

    test('Should display first name validation error messages', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      searchPage.form.firstName.fill('John123')
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('First name must contain letters only')

      await expect(searchPage.form.firstName).toHaveValidationErrorText('First name must contain letters only')
      await expect(searchPage.form.lastName).not.toHaveValidationError()
      await expect(searchPage.form.alias).not.toHaveValidationError()
    })

    test('Should display last name validation error messages', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      searchPage.form.lastName.fill('Smith123')
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('Last name must contain letters only')

      await expect(searchPage.form.firstName).not.toHaveValidationError()
      await expect(searchPage.form.lastName).toHaveValidationErrorText('Last name must contain letters only')
      await expect(searchPage.form.alias).not.toHaveValidationError()
    })

    test('Should display date of birth day validation error messages', async ({ page }) => {
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

    test('Should display alias validation error messages', async ({ page }) => {
      const searchPage = await AppPage.visit(SearchPage, page)

      searchPage.form.alias.fill('John Smith-123')
      await searchPage.form.searchButton.click()

      await AppPage.verifyOnPage(SearchPage, page)

      await expect(searchPage).toHaveErrorSummary()
      await expect(searchPage).toHaveErrorSummaryText('Alias must contain letters and spaces only')

      await expect(searchPage.form.firstName).not.toHaveValidationError()
      await expect(searchPage.form.lastName).not.toHaveValidationError()
      await expect(searchPage.form.alias).toHaveValidationErrorText('Alias must contain letters and spaces only')
    })
  })
})
