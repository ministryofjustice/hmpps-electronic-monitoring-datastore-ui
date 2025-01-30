import OrderDetailsPage from '../pages/orderDetails'
import Page from '../pages/page'

context('Order Details', () => {
  const orderId = '1232123'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')

    cy.task('stubDatastoreGetOrderDetails', {
      httpStatus: 200,
      orderId,
      details: {
        specials: 'no',
        legacySubjectId: orderId,
        legacyOrderId: orderId,
        firstName: null,
        lastName: null,
        alias: null,
        dateOfBirth: null,
        adultOrChild: null,
        sex: null,
        contact: null,
        primaryAddressLine1: null,
        primaryAddressLine2: null,
        primaryAddressLine3: null,
        primaryAddressPostCode: null,
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

  it('is reachable', () => {
    cy.visit(`/orders/${orderId}/details`)
    Page.verifyOnPage(OrderDetailsPage)
  })

  describe('Device wearer table', () => {
    it('Renders', () => {
      const orderDetailsPage = Page.verifyOnPage(OrderDetailsPage)
      orderDetailsPage.deviceWearerTable().should('be.visible')
    })

    it('Includes expected row headers', () => {
      const orderDetailsPage = Page.verifyOnPage(OrderDetailsPage)

      orderDetailsPage.deviceWearerTable().each(() => {
        orderDetailsPage.deviceWearerRowHeaders('Specials').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Legacy Subject ID').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Legacy Order ID').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('First name').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Last name').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Integrity name').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Alias').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Date of birth').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Adult/child').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Legacy Sex').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Contact').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Primary Address').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Phone/mobile number').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('PPO').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('MAPPA').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Technical bail').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Manual Risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Offence Risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Postcode Risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('False Limb Risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Migrated Risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Range Risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Report Risk').should('be.visible')
      })
    })
  })
  xdescribe('Order data table', () => {
    it('Renders', () => {
      const orderDetailsPage = Page.verifyOnPage(OrderDetailsPage)
      orderDetailsPage.orderTable().should('be.visible')
    })

    it('Includes expected row headers', () => {
      const orderDetailsPage = Page.verifyOnPage(OrderDetailsPage)

      orderDetailsPage.deviceWearerTable().each(() => {
        orderDetailsPage.deviceWearerRowHeaders('Order Start Date').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Order End Date').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Order Type').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Order Type Description').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Order Type Detail').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Wearing Wrist PID').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Notifying Organisation Name').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Responsible Organisation').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Responsible Organisation Region').should('be.visible')
      })
    })
  })
})
