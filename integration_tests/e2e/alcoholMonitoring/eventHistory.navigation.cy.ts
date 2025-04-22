import Page from '../../pages/page'
import AlcoholMonitoringOrderSummaryPage from '../../pages/alcoholMonitoring/summary'
import AlcoholMonitoringOrderDetailsPage from '../../pages/alcoholMonitoring/details'
import AlcoholMonitoringVisitDetailsPage from '../../pages/alcoholMonitoring/visitDetails'
import AlcoholMonitoringEquipmentDetailsPage from '../../pages/alcoholMonitoring/equipmentDetails'
import AlcoholMonitoringEventHistoryPage from '../../pages/alcoholMonitoring/eventHistory'
import AlcoholMonitoringServiceDetailsPage from '../../pages/alcoholMonitoring/serviceDetails'

context('Alcohol monitoring Order details navigation', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.task('stubAlcoholMonitoringGetIncidentEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })
    cy.task('stubAlcoholMonitoringGetViolationEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })
    cy.task('stubAlcoholMonitoringGetContactEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    cy.signIn()
  })

  it('Contains order summary button and navigates to expected page', () => {
    cy.task('stubAlcoholMonitoringGetOrderSummary', {
      httpStatus: 200,
      legacySubjectId,
    })

    const summaryPage = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })
  })

  it('Contains order details button and navigates to expected page', () => {
    cy.task('stubAlcoholMonitoringGetOrderDetails', {
      httpStatus: 200,
      legacySubjectId,
    })

    const summaryPage = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Order details').click()
    Page.verifyOnPage(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })
  })

  it('Contains visits details button and navigates to expected page', () => {
    cy.task('stubAlcoholMonitoringGetVisitDetails', {
      httpStatus: 200,
      legacySubjectId,
    })

    const summaryPage = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Visit details').click()
    Page.verifyOnPage(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })
  })

  it('Contains equipment details button and navigates to expected page', () => {
    cy.task('stubAlcoholMonitoringGetEquipmentDetails', {
      httpStatus: 200,
      legacySubjectId,
    })

    const summaryPage = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Equipment details').click()
    Page.verifyOnPage(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })
  })

  it('Contains services button and navigates to expected page', () => {
    cy.task('stubAlcoholMonitoringGetServiceDetails', {
      httpStatus: 200,
      legacySubjectId,
    })

    const summaryPage = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Services').click()
    Page.verifyOnPage(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })
  })
})
