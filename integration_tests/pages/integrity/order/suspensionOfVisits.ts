import AppPage from '../../appPage'
import PageElement from '../../PageElement'
import paths from '../../../../server/constants/paths'

export default class SuspensionOfVisitsPage extends AppPage {
  constructor() {
    super('Suspension of visits', paths.INTEGRITY_ORDER.SUSPENSION_OF_VISITS)
  }

  timeline = (): PageElement => cy.get('.moj-timeline')

  timelineItems = (): PageElement => cy.get('.moj-timeline__item')

  itemTableHeaders = (headerText: string): PageElement => cy.get('.govuk-summary-list__key').contains(headerText)
}
