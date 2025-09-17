import Page from '../../pages/page'
import IntegrityOrderSummaryPage from '../../pages/integrity/summary'
import OrderDetailsPage from '../../pages/integrity/details'
import VisitDetailsPage from '../../pages/integrity/visitDetails'
import EquipmentDetailsPage from '../../pages/integrity/equipmentDetails'
import SuspensionOfVisitsPage from '../../pages/integrity/suspensionOfVisits'
import EventHistoryPage from '../../pages/integrity/eventHistory'
import ServiceDetailsPage from '../../pages/integrity/serviceDetails'

context('Integrity Order summary navigation', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.task('stubIntegrityGetOrderDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: {
        specials: 'no',
        legacySubjectId,
        name: 'Testopher Fakesmith',
        alias: 'an old tv show',
        dateOfBirth: '1950-01-01',
        primaryAddressLine1: '123 Fourth Street',
        primaryAddressLine2: 'Fiveton',
        primaryAddressLine3: 'Sixbury',
        primaryAddressPostCode: '7AB 8CD',
        orderStartDate: '2010-01-01',
        orderEndDate: '2030-01-01',
        offenceRisk: false,
      },
    })

    cy.signIn()
  })

  it('Contains order details button and navigates to expected page', () => {
    cy.task('stubIntegrityGetOrderDetails', {
      httpStatus: 200,
      legacySubjectId,
      details: {
        specials: 'no',
        legacySubjectId,
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

    const summaryPage = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Order details').click()
    const orderDetailsPage = Page.verifyOnPage(OrderDetailsPage, { legacySubjectId })

    orderDetailsPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(IntegrityOrderSummaryPage, { legacySubjectId })
  })

  it('Contains visits details button and navigates to expected page', () => {
    cy.task('stubIntegrityGetVisitDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const summaryPage = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Visit details').click()
    const visitDetailsPage = Page.verifyOnPage(VisitDetailsPage, { legacySubjectId })

    visitDetailsPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(IntegrityOrderSummaryPage, { legacySubjectId })
  })

  it('Contains equipment details button and navigates to expected page', () => {
    cy.task('stubIntegrityGetEquipmentDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const summaryPage = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Equipment details').click()
    const equipmentDetailsPage = Page.verifyOnPage(EquipmentDetailsPage, { legacySubjectId })

    equipmentDetailsPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(IntegrityOrderSummaryPage, { legacySubjectId })
  })

  it('Contains suspension of visits button and navigates to expected page', () => {
    cy.task('stubIntegrityGetSuspensionOfVisits', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const summaryPage = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Suspension of visits').click()
    const suspensionOfVisitsPage = Page.verifyOnPage(SuspensionOfVisitsPage, { legacySubjectId })

    suspensionOfVisitsPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(IntegrityOrderSummaryPage, { legacySubjectId })
  })

  it('Contains all event history button and navigates to expected page', () => {
    cy.task('stubIntegrityGetMonitoringEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })
    cy.task('stubIntegrityGetIncidentEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })
    cy.task('stubIntegrityGetViolationEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })
    cy.task('stubIntegrityGetContactEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const summaryPage = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('All event history').click()
    const eventHistoryPage = Page.verifyOnPage(EventHistoryPage, { legacySubjectId })

    eventHistoryPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(IntegrityOrderSummaryPage, { legacySubjectId })
  })

  it('Contains services button and navigates to expected page', () => {
    cy.task('stubIntegrityGetServiceDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const summaryPage = Page.visit(IntegrityOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Services').click()
    const serviceDetailsPage = Page.verifyOnPage(ServiceDetailsPage, { legacySubjectId })

    serviceDetailsPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(IntegrityOrderSummaryPage, { legacySubjectId })
  })
})
