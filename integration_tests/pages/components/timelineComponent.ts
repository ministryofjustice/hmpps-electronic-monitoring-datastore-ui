/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

class TimelineItemDescriptionComponent {
  private elementCacheId: string = uuidv4()

  constructor(private readonly description: PageElement) {
    description.as(`${this.elementCacheId}-element`)
  }

  protected get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  get list(): PageElement {
    return this.element.find('.govuk-summary-list', { log: false })
  }

  // Helpers

  shouldNotExist() {
    this.element.should('not.exist')
    this.list.should('not.exist')
  }

  shouldBeVisible() {
    this.element.should('exist')
    this.list.should('exist')
    this.element.should('be.visible')
    this.list.should('be.visible')
  }

  shouldNotBeVisible() {
    this.element.should('exist')
    this.list.should('exist')
    this.element.should('not.be.visible')
    this.list.should('not.be.visible')
  }

  shouldHaveItem(key: string, value: string) {
    return this.list
      .contains('.govuk-summary-list__key', key, { log: false })
      .siblings('.govuk-summary-list__value', { log: false })
      .should('contain.text', value)
  }

  shouldHaveItems(items: Array<{ key: string; value: string }>) {
    return items.map(({ key, value }) => this.shouldHaveItem(key, value))
  }

  shouldNotHaveItem(key: string) {
    return this.list.should('not.contain.text', key)
  }

  shouldNotHaveItems(keys: Array<string>) {
    return keys.map(key => this.shouldNotHaveItem(key))
  }
}

class TimelineItem {
  private elementCacheId: string = uuidv4()

  constructor(row: PageElement) {
    row.as(`${this.elementCacheId}-element`)
  }

  protected get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  get description(): TimelineItemDescriptionComponent {
    return new TimelineItemDescriptionComponent(this.element.find('.moj-timeline__description'))
  }

  // Helpers

  shouldNotExist() {
    this.element.should('not.exist')
  }

  shouldBeVisible() {
    this.element.should('exist')
    this.element.should('be.visible')
  }

  shouldNotBeVisible() {
    this.element.should('exist')
    this.element.should('not.be.visible')
  }

  shouldHaveTitle(title: string) {
    this.element.contains('h2', title)
  }

  shouldHaveDate(date: string) {
    this.element.contains('time', date)
  }
}

export default class timelineComponent {
  private elementCacheId: string

  private className: string = '.moj-timeline'

  private itemClassName: string = '.moj-timeline__item'

  private get element(): PageElement {
    if (!this.elementCacheId) {
      this.elementCacheId = uuidv4()

      cy.get('body', { log: false }).then($body => {
        const $el = $body.find(this.className)
        cy.wrap($el.length ? $el : undefined, { log: false }).as(`${this.elementCacheId}-element`)
      })
    }

    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  private get items(): PageElement {
    return this.element.find(this.itemClassName, { log: false })
  }

  item(index: number): TimelineItem {
    return new TimelineItem(this.items.eq(index, { log: false }))
  }

  // Helpers

  shouldNotExist() {
    this.element.should('not.exist')
  }

  shouldBeVisible() {
    this.element.should('exist')
    this.element.should('be.visible')
  }

  shouldNotBeVisible() {
    this.element.should('exist')
    this.element.should('not.be.visible')
  }
}
