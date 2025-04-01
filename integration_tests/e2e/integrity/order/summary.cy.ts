import Page from '../../../pages/page'
import SummaryPage from '../../../pages/integrity/order/summary'
import OrderDetailsPage from '../../../pages/integrity/order/details'
import VisitDetailsPage from '../../../pages/integrity/order/visitDetails'
import EquipmentDetailsPage from '../../../pages/integrity/order/equipmentDetails'
import SuspensionOfVisitsPage from '../../../pages/integrity/order/suspensionOfVisits'
import EventHistoryPage from '../../../pages/integrity/order/eventHistory'
import CurfewTimetablePage from '../../../pages/integrity/order/curfewTimetable'

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
        legacyOrderId: legacySubjectId,
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

  it('Should display the user name visible in header', () => {
    const page = Page.visit(SummaryPage, { legacySubjectId })
    page.header.userName.should('contain.text', 'M. Tester')
  })

  it('Should display the phase banner in header', () => {
    const page = Page.visit(SummaryPage, { legacySubjectId })
    page.header.phaseBanner.should('contain.text', 'dev')
  })

  it('Should display the back link', () => {
    const page = Page.visit(SummaryPage, { legacySubjectId })

    page.backButton.should('exist')
  })

  it('Should be accessible', () => {
    const page = Page.visit(SummaryPage, { legacySubjectId })
    page.checkIsAccessible()
  })

  describe('Order information details', () => {
    it('Includes expected rows', () => {
      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.orderInformationDetails.within($summary => {
        cy.wrap($summary).getBySummaryListKey('Specials').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Legacy Subject ID').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Legacy Order ID').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Name').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Alias').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Date of birth').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Primary address').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Order start date').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Order end date').should('be.visible')
      })
    })

    it('Displays primary address values in a single cell', () => {
      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.orderInformationDetails
        .getBySummaryListKey('Primary address')
        .contains('123 Fourth StreetFivetonSixbury7AB 8CD')
    })
  })

  describe('Grid buttons', () => {
    it('Contains order details button and navigates to expected page', () => {
      cy.task('stubDatastoreGetOrderDetails', {
        httpStatus: 200,
        legacySubjectId,
        details: {
          specials: 'no',
          legacySubjectId,
          legacyOrderId: legacySubjectId,
          firstName: null,
          lastName: null,
          alias: null,
          dateOfBirth: null,
          adultOrChild: null,
          sex: null,
          contact: null,
          primaryAddressLine1: 'primaryAddressLine1',
          primaryAddressLine2: 'primaryAddressLine2',
          primaryAddressLine3: null,
          primaryAddressPostCode: 'primaryAddressPostCode',
          phoneOrMobileNumber: null,
          ppo: null,
          mappa: null,
          technicalBail: null,
          manualRisk: null,
          offenceRisk: false,
          postCodeRisk: null,
          falseLimbRisk: null,
          migratedRisk: null,
          rangeRisk: null,
          reportRisk: null,
          orderStartDate: null,
          orderEndDate: null,
          orderType: null,
          orderTypeDescription: null,
          orderTypeDetail: null,
          wearingWristPid: null,
          notifyingOrganisationDetailsName: null,
          responsibleOrganisation: null,
          responsibleOrganisationDetailsRegion: null,
        },
      })

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.subNavigationLink('Order details').click()
      Page.verifyOnPage(OrderDetailsPage, { legacySubjectId })
    })

    it('Contains visits details button and navigates to expected page', () => {
      cy.task('stubDatastoreGetVisitDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.subNavigationLink('Visit details').click()
      Page.verifyOnPage(VisitDetailsPage, { legacySubjectId })
    })

    it('Contains equipment details button and navigates to expected page', () => {
      cy.task('stubDatastoreGetEquipmentDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.subNavigationLink('Equipment details').click()
      Page.verifyOnPage(EquipmentDetailsPage, { legacySubjectId })
    })

    it('Contains suspension of visits button and navigates to expected page', () => {
      cy.task('stubDatastoreGetSuspensionOfVisits', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.subNavigationLink('Suspension of visits').click()
      Page.verifyOnPage(SuspensionOfVisitsPage, { legacySubjectId })
    })

    it('Contains all event history button and navigates to expected page', () => {
      cy.task('stubDatastoreGetMonitoringEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })
      cy.task('stubDatastoreGetIncidentEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })
      cy.task('stubDatastoreGetViolationEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })
      cy.task('stubDatastoreGetContactEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.subNavigationLink('All event history').click()
      Page.verifyOnPage(EventHistoryPage, { legacySubjectId })
    })

    it('Contains services button and navigates to expected page', () => {
      cy.task('stubDatastoreGetCurfewTimetable', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })

      const summaryPage = Page.visit(SummaryPage, { legacySubjectId })
      summaryPage.subNavigationLink('Services').click()
      Page.verifyOnPage(CurfewTimetablePage, { legacySubjectId })
    })
  })
})
