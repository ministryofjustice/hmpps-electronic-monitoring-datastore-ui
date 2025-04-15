import Page from '../../pages/page'
import AlcoholMonitoringOrderSummaryPage from '../../pages/alcoholMonitoring/summary'
import AlcoholMonitoringOrderDetailsPage from '../../pages/alcoholMonitoring/details'
import AlcoholMonitoringVisitDetailsPage from '../../pages/alcoholMonitoring/visitDetails'
import AlcoholMonitoringEquipmentDetailsPage from '../../pages/alcoholMonitoring/equipmentDetails'
import AlcoholMonitoringEventHistoryPage from '../../pages/alcoholMonitoring/eventHistory'
import AlcoholMonitoringServiceDetailsPage from '../../pages/alcoholMonitoring/serviceDetails'

import { AlcoholMonitoringOrderSummary } from '../../../server/models/alcoholMonitoring/orderSummary'

context('Alcohol monitoring Order summary navigation', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.task('stubAlcoholMonitoringGetOrderSummary', {
      httpStatus: 200,
      legacySubjectId,
      body: {
        legacySubjectId,
        legacyOrderId: legacySubjectId,
        firstName: 'Testopher',
        lastName: 'Fakesmith',
        alias: 'an old tv show',
        dateOfBirth: '1950-01-01',
        postcode: '7AB 8CD',
        address1: '123 Fourth Street',
        address2: 'Fiveton',
        address3: 'Sixbury',
        orderStartDate: '2010-01-01T00:00:00',
        orderEndDate: '2030-01-01T00:00:00',
      } as AlcoholMonitoringOrderSummary,
    })

    cy.signIn()
  })

  it.skip('Contains order details button and navigates to expected page', () => {
    cy.task('stubAlcoholMonitoringGetOrderDetails', {
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

    const summaryPage = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Order details').click()
    const orderDetailsPage = Page.verifyOnPage(AlcoholMonitoringOrderDetailsPage, { legacySubjectId })

    orderDetailsPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })
  })

  it.skip('Contains visits details button and navigates to expected page', () => {
    cy.task('stubAlcoholMonitoringGetVisitDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const summaryPage = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Visit details').click()
    const visitDetailsPage = Page.verifyOnPage(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })

    visitDetailsPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })
  })

  it.skip('Contains equipment details button and navigates to expected page', () => {
    cy.task('stubAlcoholMonitoringGetEquipmentDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const summaryPage = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Equipment details').click()
    const equipmentDetailsPage = Page.verifyOnPage(AlcoholMonitoringEquipmentDetailsPage, { legacySubjectId })

    equipmentDetailsPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })
  })

  it.skip('Contains all event history button and navigates to expected page', () => {
    cy.task('stubAlcoholMonitoringGetMonitoringEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })
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

    const summaryPage = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('All event history').click()
    const eventHistoryPage = Page.verifyOnPage(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

    eventHistoryPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })
  })

  it.skip('Contains services button and navigates to expected page', () => {
    cy.task('stubAlcoholMonitoringGetServiceDetails', {
      httpStatus: 200,
      legacySubjectId,
      body: [],
    })

    const summaryPage = Page.visit(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })

    summaryPage.subNavigationLink('Services').click()
    const serviceDetailsPage = Page.verifyOnPage(AlcoholMonitoringServiceDetailsPage, { legacySubjectId })

    serviceDetailsPage.subNavigationLink('Order summary').click()
    Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage, { legacySubjectId })
  })
})
