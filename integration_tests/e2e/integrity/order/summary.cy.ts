import Page from '../../../pages/page'
import SummaryPage from '../../../pages/order/summary'
import OrderDetailsPage from '../../../pages/order/details'
import VisitDetailsPage from '../../../pages/order/visitDetails'
import EquipmentDetailsPage from '../../../pages/order/equipmentDetails'
import SuspensionOfVisitsPage from '../../../pages/order/suspensionOfVisits'
import EventHistoryPage from '../../../pages/order/eventHistory'
import CurfewTimetablePage from '../../../pages/order/curfewTimetable'

context('Order Information', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.task('stubDatastoreGetOrderSummary', {
      httpStatus: 200,
      legacySubjectId,
      events: [],
      keyOrderInformation: {
        specials: 'no',
        legacySubjectId,
        legacyOrderId: '1234567',
        name: 'Testopher Fakesmith',
        alias: 'an old tv show',
        dateOfBirth: '1950-01-01',
        postcode: '7AB 8CD',
        address1: '123 Fourth Street',
        address2: 'Fiveton',
        address3: 'Sixbury',
        orderStartDate: '2010-01-01',
        orderEndDate: '2030-01-01',
      },
      subjectHistoryReport: {
        reportUrl: '',
        name: '',
        createdOn: '',
        time: '',
      },
      documents: {
        pageSize: 1,
        orderDocuments: [],
      },
    })

    cy.signIn()
  })

  it('is reachable', () => {
    cy.visit(`/integrity/orders/${legacySubjectId}`)
    Page.verifyOnPage(SummaryPage)
  })

  describe('Order information table', () => {
    it('Includes expected rows', () => {
      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.orderInformationTable().each(() => {
        summaryPage.tableRowHeaders('Specials').should('be.visible')
        summaryPage.tableRowHeaders('Legacy Subject ID').should('be.visible')
        summaryPage.tableRowHeaders('Legacy Order ID').should('be.visible')
        summaryPage.tableRowHeaders('Name').should('be.visible')
        summaryPage.tableRowHeaders('Alias').should('be.visible')
        summaryPage.tableRowHeaders('Date of birth').should('be.visible')
        summaryPage.tableRowHeaders('Primary address').should('be.visible')
        summaryPage.tableRowHeaders('Order start date').should('be.visible')
        summaryPage.tableRowHeaders('Order end date').should('be.visible')
      })
    })
  })

  describe('Grid buttons', () => {
    it('Contains order details button and navigates to expected page', () => {
      cy.task('stubDatastoreGetOrderDetails')

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.gridButton('Order details').click()
      Page.verifyOnPage(OrderDetailsPage, { legacySubjectId })
    })

    it('Contains visits details button and navigates to expected page', () => {
      cy.task('stubDatastoreGetVisitDetails')

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.gridButton('Visit details').click()
      Page.verifyOnPage(VisitDetailsPage, { legacySubjectId })
    })

    it('Contains equipment details button and navigates to expected page', () => {
      cy.task('stubDatastoreGetEquipmentDetails')

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.gridButton('Equipment details').click()
      Page.verifyOnPage(EquipmentDetailsPage, { legacySubjectId })
    })

    it('Contains suspension of visits button and navigates to expected page', () => {
      cy.task('stubDatastoreGetSuspensionOfVisits')

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.gridButton('Suspension of visits').click()
      Page.verifyOnPage(SuspensionOfVisitsPage, { legacySubjectId })
    })

    it('Contains all event history button and navigates to expected page', () => {
      cy.task('stubDatastoreGetEventHistory')

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.gridButton('All event history').click()
      Page.verifyOnPage(EventHistoryPage, { legacySubjectId })
    })

    it('Contains services button and navigates to expected page', () => {
      cy.task('stubDatastoreGetCurfewTimetable')

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.gridButton('Services').click()
      Page.verifyOnPage(CurfewTimetablePage, { legacySubjectId })
    })
  })
})
