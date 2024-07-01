import Page, { PageElement } from './page'

export default class SearchPage extends Page {
  constructor() {
    super('Search for case details')
  }

  subjectIdField = (): PageElement => cy.get('#subject-id')

  subjectIdLabel = (): PageElement => cy.get('#subject-id').prev('label')

  firstNameField = (): PageElement => cy.get('#first-name')

  firstNameLabel = (): PageElement => cy.get('#first-name').prev('label')

  lastNameField = (): PageElement => cy.get('#last-name')

  lastNameLabel = (): PageElement => cy.get('#last-name').prev('label')

  dateOfBirthLegend = (): PageElement => cy.get('#date-of-birth').prev('legend')

  dayOfBirthField = (): PageElement => cy.get('#date-of-birth-day')

  dayOfBirthLabel = (): PageElement => cy.get('#date-of-birth-day').prev('label')

  monthOfBirthField = (): PageElement => cy.get('#date-of-birth-month')

  monthOfBirthLabel = (): PageElement => cy.get('#date-of-birth-month').prev('label')

  yearOfBirthField = (): PageElement => cy.get('#date-of-birth-year')

  yearOfBirthLabel = (): PageElement => cy.get('#date-of-birth-year').prev('label')

  aliasField = (): PageElement => cy.get('#alias')

  aliasLabel = (): PageElement => cy.get('#alias').prev('label')

  searchButton = (): PageElement => cy.get('#case-search-form').children('button')
}
