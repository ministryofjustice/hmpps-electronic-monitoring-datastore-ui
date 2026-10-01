import { expect, test } from '@playwright/test'

import { login, resetStubs } from '../testUtils'

import AppPage from '../pages/appPage'
import NotFoundErrorPage from '../pages/notFoundErrorPage'
import StartPage from '../pages/startPage'

test.describe('Not found', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { name: 'M. Tester' })
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Displays the user name visible in header', async ({ page }): Promise<void> => {
    await page.goto(`/integrity/00001/invalidaddress`)

    const notFoundErrorPage = await AppPage.verifyOnPage(NotFoundErrorPage, page)

    await expect(notFoundErrorPage.usersName).toContainText('M. Tester')
  })

  test('Displays the phase banner in header', async ({ page }): Promise<void> => {
    await page.goto(`/integrity/00002/invalidaddress`)

    const notFoundErrorPage = await AppPage.verifyOnPage(NotFoundErrorPage, page)

    await expect(notFoundErrorPage.phaseBanner).toContainText('DEV', { ignoreCase: false })
  })

  test('Displays the back link', async ({ page }): Promise<void> => {
    await page.goto(`/integrity/00003/invalidaddress`)

    const notFoundErrorPage = await AppPage.verifyOnPage(NotFoundErrorPage, page)
    await notFoundErrorPage.goBack()

    await StartPage.verifyOnPage(StartPage, page)
  })

  test('Is accessible', async ({ page }): Promise<void> => {
    await page.goto(`/integrity/00004/invalidaddress`)

    const notFoundErrorPage = await AppPage.verifyOnPage(NotFoundErrorPage, page)

    await notFoundErrorPage.checkIsAccessible()
  })
})
