/* eslint-disable max-classes-per-file */
import { type Locator, type Page } from '@playwright/test'

import SummaryListComponent from './summaryListComponent'

class TimelineEntryComponent {
  readonly element: Locator

  readonly title: Locator

  readonly date: Locator

  constructor(
    private readonly parent: Locator,
    private readonly index: number,
  ) {
    this.element = this.parent.locator('.events-timeline__item').nth(this.index)
    this.title = this.element.locator('.moj-timeline__title')
    this.date = this.element.locator('.moj-timeline__date')
  }

  getDescription(label: string): SummaryListComponent {
    const description = this.element.locator('.moj-timeline__description')
    return new SummaryListComponent(description, label)
  }
}

export default class TimelineComponent {
  readonly element: Locator

  readonly timeline: Locator

  readonly noResultsHeading: Locator

  readonly noResultsMessage: Locator

  constructor(private readonly parent: Page | Locator) {
    this.element = this.parent.locator('.events-timeline')

    this.timeline = this.element.locator('.events-timeline__timeline')

    this.noResultsHeading = this.parent.locator('.no-results-heading')
    this.noResultsMessage = this.parent.locator('.no-results-message')
  }

  getEntry(index: number): TimelineEntryComponent {
    return new TimelineEntryComponent(this.timeline, index)
  }

  // Helpers

  async isVisible(): Promise<boolean> {
    return this.element.isVisible()
  }

  async hasEntries(): Promise<number> {
    return (await this.timeline.locator('.events-timeline__item').all()).length
  }
}
