import Page from '../../../pages/page'
import OrderDetailsPage from '../../../pages/integrity/order/details'

context('Order Details', () => {
  const legacySubjectId = '1232123'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

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
        primaryAddressLine1: 'Address line 1',
        primaryAddressLine2: 'Address line 2',
        primaryAddressLine3: 'Address line 3',
        primaryAddressPostCode: 'Postcode',
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

    cy.signIn()
  })

  it('Should display the user name visible in header', () => {
    const page = Page.visit(OrderDetailsPage, { legacySubjectId })
    page.header.userName.should('contain.text', 'M. Tester')
  })

  it('Should display the phase banner in header', () => {
    const page = Page.visit(OrderDetailsPage, { legacySubjectId })
    page.header.phaseBanner.should('contain.text', 'dev')
  })

  it('Should display the back link', () => {
    const page = Page.visit(OrderDetailsPage, { legacySubjectId })

    page.backButton.should('exist')
  })

  it('Should be accessible', () => {
    const page = Page.visit(OrderDetailsPage, { legacySubjectId })
    page.checkIsAccessible()
  })

  describe('Device wearer table', () => {
    it('Renders', () => {
      const orderDetailsPage = Page.visit(OrderDetailsPage, { legacySubjectId })
      orderDetailsPage.deviceWearerDetails.should('be.visible')
    })

    it('Includes expected row headers', () => {
      const orderDetailsPage = Page.visit(OrderDetailsPage, { legacySubjectId })
      orderDetailsPage.deviceWearerDetails.within($summary => {
        cy.wrap($summary).getBySummaryListKey('Specials').contains('no')
        cy.wrap($summary).getBySummaryListKey('Legacy subject ID').contains(legacySubjectId)
        cy.wrap($summary).getBySummaryListKey('Legacy order ID').contains(legacySubjectId)

        cy.wrap($summary).getBySummaryListKey('First name').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Last name').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Alias').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Date of birth').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Adult/child').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Legacy sex').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Contact').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Primary address').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Phone/mobile number').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('PPO').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('MAPPA').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Technical bail').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Manual risk').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Offence risk').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Postcode risk').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('False limb risk').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Migrated risk').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Range risk').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Report risk').should('be.visible')
      })
    })

    it('Displays primary address values in a single cell', () => {
      const orderDetailsPage = Page.visit(OrderDetailsPage, { legacySubjectId })
      orderDetailsPage.deviceWearerDetails
        .getBySummaryListKey('Primary address')
        .contains('Address line 1Address line 2Address line 3Postcode')
    })
  })

  describe('Order data table', () => {
    it('Renders', () => {
      const orderDetailsPage = Page.visit(OrderDetailsPage, { legacySubjectId })
      orderDetailsPage.orderDetails.should('be.visible')
    })

    it('Includes expected row headers', () => {
      const orderDetailsPage = Page.visit(OrderDetailsPage, { legacySubjectId })
      orderDetailsPage.orderDetails.within($summary => {
        cy.wrap($summary).getBySummaryListKey('Order start date').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Order end date').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Order type').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Order type description').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Order type detail').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Wearing wrist PID').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Notifying organisation name').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Responsible organisation').should('be.visible')
        cy.wrap($summary).getBySummaryListKey('Responsible organisation region').should('be.visible')
      })
    })
  })
})
