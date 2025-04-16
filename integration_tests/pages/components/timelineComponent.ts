/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

class TimelineItemDescriptionComponent {
  private elementCacheId: string

  private className = '.moj-timeline__description'

  constructor(private readonly timelineItem: PageElement) {
    if (!this.elementCacheId) {
      this.elementCacheId = uuidv4()

      timelineItem.then($timelineItem => {
        const $el = $timelineItem.find(this.className)
        return cy.wrap($el.length ? $el : undefined, { log: false }).as(`${this.elementCacheId}-element`)
      })
    }
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
      .then($item => cy.wrap($item.text().trim().replace(/\s+/g, ' ')).should('equal', value))
  }

  shouldHaveItems(items: Array<{ key: string; value: string }>) {
    return items.map(({ key, value }) => this.shouldHaveItem(key, value))
  }

  shouldNotHaveItem(key: string) {
    return this.list.then($items => {
      $items.each((_, $el) => {
        cy.wrap($el.innerText.trim().replace(/\s+/g, ' ')).should('not.equal', key)
      })
    })
  }

  shouldNotHaveItems(keys: Array<string>) {
    return keys.map(key => this.shouldNotHaveItem(key))
  }
}

class TimelineItem {
  private elementCacheId: string

  constructor(row: PageElement, index: number) {
    if (!this.elementCacheId) {
      this.elementCacheId = uuidv4()

      row.then($timelineItems => {
        const $el = $timelineItems.eq(index)
        return cy.wrap($el.length ? $el : undefined, { log: false }).as(`${this.elementCacheId}-element`)
      })
    }
  }

  protected get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  get description(): TimelineItemDescriptionComponent {
    return new TimelineItemDescriptionComponent(this.element)
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
    this.element
      .find('.moj-timeline__title', { log: false })
      .then($item => cy.wrap($item.text().trim().replace(/\s+/g, ' ')).should('equal', title))
  }

  shouldHaveDate(date: string) {
    this.element
      .find('.moj-timeline__date', { log: false })
      .then($item => cy.wrap($item.text().trim().replace(/\s+/g, ' ')).should('equal', date))
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
        return cy.wrap($el.length ? $el : undefined, { log: false }).as(`${this.elementCacheId}-element`)
      })
    }

    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  private get items(): PageElement {
    return this.element.find(this.itemClassName, { log: false })
  }

  item(index: number): TimelineItem {
    return new TimelineItem(this.items, index)
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

  shouldHaveCount(numberOfItems: number) {
    this.items.should('have.length', numberOfItems)
  }
}
