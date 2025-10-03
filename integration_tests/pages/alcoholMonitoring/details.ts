import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'
import SummaryListComponent from '../components/summaryListComponent'

export default class AlcoholMonitoringOrderDetailsPage extends AppPage {
  constructor() {
    super('Order details', paths.ALCOHOL_MONITORING.DETAILS)
  }

  get deviceWearerDetails(): SummaryListComponent {
    return new SummaryListComponent('Device wearer')
  }

  get orderDetails(): SummaryListComponent {
    return new SummaryListComponent('Order')
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
