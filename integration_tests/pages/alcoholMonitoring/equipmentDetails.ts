import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'
import TimelineComponent from '../components/timelineComponent'

export default class EquipmentDetailsPage extends AppPage {
  constructor() {
    super('Equipment details', paths.ALCOHOL_MONITORING.EQUIPMENT_DETAILS)
  }

  get timeline(): TimelineComponent {
    return new TimelineComponent()
  }

  get noResultsHeading(): PageElement {
    return cy.get('.no-results-heading')
  }

  get noResultsMessage(): PageElement {
    return cy.get('.no-results-message')
  }

  subNavigationLink = (buttonText: string): PageElement => cy.get('.moj-sub-navigation__link').contains(buttonText)
}
