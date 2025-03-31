import AppPage from '../appPage'
import PageElement from '../PageElement'
import paths from '../../../server/constants/paths'

export default class OrderSummaryPage extends AppPage {
  constructor() {
    super('Key order details', paths.INTEGRITY_ORDER.SUMMARY)
  }

  override checkOnPage(): void {
    cy.get('caption').contains('Order information')
  }

  orderInformationTable = (): PageElement => cy.get('.govuk-table__body')

  tableRowHeaders = (rowHeaderText: string): PageElement => cy.get('.govuk-table__header').contains(rowHeaderText)

  gridButton = (buttonText: string): PageElement => cy.get('.ems-button-grid__button').contains(buttonText)

  // TODO: Below elements are used exclusively in the document tests - which are currently disabled
  dateFilter = (): PageElement => cy.get('.ems-date-filter')

  dateFilterRow = (): PageElement => cy.get('.ems-date-filter__input-row')

  clearFilterLink = (linkText: string): PageElement =>
    cy.get('.ems-date-filter__clear-filter-button').contains(linkText)

  applyButton = (): PageElement => cy.get('.ems-date-filter__filter-button')

  tabsList = (): PageElement => cy.get('.govuk-tabs__list')

  documentsTab = (tabText: string): PageElement => cy.get('.govuk-tabs__tab').contains(tabText)

  tabsPanel = (panelID: string): PageElement => cy.get(panelID)
}
