import Page, { PageElement } from './page'

export default class SearchPage extends Page {
  constructor() {
    super('Search for case details')
  }

  subjectIdField = (): PageElement => cy.get('#subject-id')

  subjectIdLabel = (): PageElement => cy.get('#subject-id').prev('label')
}
