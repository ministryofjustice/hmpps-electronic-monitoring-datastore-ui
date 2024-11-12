import Page, { PageElement } from './page'

export default class SearchPage extends Page {
  constructor() {
    super('Search for order details')
  }

  serviceInformation = (): PageElement => cy.get('.service-information')

  serviceInformationText = (): PageElement => cy.get('.service-information').children('.govuk-warning-text__text')

  subjectIdField = (): PageElement => cy.get('#subject-id')

  subjectIdLabel = (): PageElement => cy.get('#subject-id').siblings('label')

  firstNameField = (): PageElement => cy.get('#first-name')

  firstNameLabel = (): PageElement => cy.get('#first-name').siblings('label')

  lastNameField = (): PageElement => cy.get('#last-name')

  lastNameLabel = (): PageElement => cy.get('#last-name').siblings('label')

  dateOfBirthLegend = (): PageElement => cy.get('#dob').siblings('legend')

  dayOfBirthField = (): PageElement => cy.get('#dob-day')

  dayOfBirthLabel = (): PageElement => cy.get('#dob-day').siblings('label')

  monthOfBirthField = (): PageElement => cy.get('#dob-month')

  monthOfBirthLabel = (): PageElement => cy.get('#dob-month').siblings('label')

  yearOfBirthField = (): PageElement => cy.get('#dob-year')

  yearOfBirthLabel = (): PageElement => cy.get('#dob-year').siblings('label')

  aliasField = (): PageElement => cy.get('#alias')

  aliasLabel = (): PageElement => cy.get('#alias').siblings('label')

  searchButton = (): PageElement => cy.get('#order-search-form').children('button')
}
