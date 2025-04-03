import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'

export default class OrderSummaryPage extends AppPage {
  constructor() {
    super('Key order details', paths.INTEGRITY_ORDER.SUMMARY)
  }

  get orderInformationDetails(): PageElement {
    return cy.contains('h2', 'Order information').next('.govuk-summary-list')
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
