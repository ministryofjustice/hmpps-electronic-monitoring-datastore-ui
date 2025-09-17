import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'
import SummaryListComponent from '../components/summaryListComponent'

export default class OrderSummaryPage extends AppPage {
  constructor() {
    super('Key order details', paths.INTEGRITY_ORDER.SUMMARY, 'Order information')
  }

  get summaryDetails(): SummaryListComponent {
    return new SummaryListComponent('Order information')
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
