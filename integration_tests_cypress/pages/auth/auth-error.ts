import Page from '../page'
import PageElement from '../PageElement'

export default class AuthErrorPage extends Page {
  constructor() {
    super('Sorry, but you are not authorised', '/authError')
  }

  errorMessage = (): PageElement => cy.get('p')
}
