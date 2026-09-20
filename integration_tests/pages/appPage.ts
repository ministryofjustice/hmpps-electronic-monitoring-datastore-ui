import { expect, type Locator, type Page } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

import AbstractPage from './abstractPage'

import { buildUrl } from '../../server/utils/utils'

export const extractParamsAndArgs = (args: unknown[]) => {
  let page: Page | null = null
  let params: Record<string, string | number | boolean> = {}
  let query: Record<string, string | number | boolean> = {}

  page = args.shift() as Page

  if (typeof args[0] !== 'string') {
    params = args.shift() as Record<string, string | number | boolean>
    query = args.shift() as Record<string, string | number | boolean>
  }

  return { page, params, query }
}

export default class AppPage extends AbstractPage {
  static async verifyOnPage<T extends AppPage, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    page: Page,
    title: string,
    params?: object,
    query?: object,
    ...args: Args
  ): Promise<T>

  static async verifyOnPage<T extends AppPage, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    page: Page,
    title: string,
    ...args: Args
  ): Promise<T>

  static async verifyOnPage<T extends AppPage, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    page: Page,
    ...args: Args
  ): Promise<T>

  static async verifyOnPage<T extends AppPage, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    page: Page,
  ): Promise<T>

  static async verifyOnPage<T extends AppPage, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    ...args: Args
  ): Promise<T> {
    const { page, params, query } = extractParamsAndArgs(args)
    const expectedPage = new constructor(...([page, ...args] as Args))

    await expectedPage.checkOnPage()

    if (expectedPage.uri && !(expectedPage.uri as RegExp)) {
      await expectedPage.checkUrl(params, query)
    }

    return expectedPage
  }

  static async visit<T extends AppPage, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    page: Page,
    params?: object,
    query?: object,
    ...args: Args
  ): Promise<T>

  static async visit<T extends AppPage, Args extends unknown[]>(
    constructor: new (...args: Args) => T,
    ...args: Args
  ): Promise<T> {
    const { params, query } = extractParamsAndArgs(args)
    const page = new constructor(...args)

    if (!page.uri) {
      throw new Error(`${constructor} has no <uri: string> defined so it is not possible to visit it.`)
    }
    const url = buildUrl(page.uri as string, params, query)
    await page.page.goto(url)

    await page.checkOnPage()
    return page
  }

  readonly title: string

  readonly uri?: string | RegExp

  readonly subtitle?: string

  readonly header: Locator

  readonly backLink: Locator

  constructor(page: Page, title: string, uri?: string | RegExp, subtitle?: string) {
    super(page)

    this.title = title
    this.uri = uri
    this.subtitle = subtitle

    this.header = this.page.locator('h1', { hasText: this.title })

    this.backLink = this.page.getByRole('link', { name: 'Back', exact: true })
  }

  async checkOnPage(): Promise<void> {
    await expect(this.header).toBeVisible()

    if (this.subtitle) {
      this.page.locator('h2, legend', { hasText: this.subtitle })
    }
  }

  async checkIsAccessible(): Promise<void> {
    const accessibilityScanResults = await new AxeBuilder({ page: this.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22a', 'wcag22aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  }

  async checkUrl(
    params: Record<string, string | number | boolean> = {},
    query: Record<string, string | number | boolean> = {},
  ): Promise<void> {
    const url = buildUrl(this.uri as string, params, query)

    expect(this.page.url).toBe(url)
  }

  async goBack(): Promise<void> {
    await this.page.getByRole('link', { name: 'Back', exact: true }).click()
  }

  async serviceInformation(): Promise<Locator> {
    return this.page.getByText('This service gives you access to all order data that was held by Capita and G4S', {
      exact: true,
    })
  }
}
