import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'

export default class OrderDetailsPage extends AppPage {
  constructor() {
    super('Order details', paths.INTEGRITY_ORDER.DETAILS)
  }

  get deviceWearerDetails(): PageElement {
    return cy.contains('h2', 'Device wearer').next('.govuk-summary-list')
  }

  get orderDetails(): PageElement {
    return cy.contains('h2', 'Order').next('.govuk-summary-list')
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
