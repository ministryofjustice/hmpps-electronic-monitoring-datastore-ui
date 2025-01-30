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
    cy.visit(`/orders/${orderId}/details`)
  })

  it('is reachable', () => {
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
        orderDetailsPage.deviceWearerRowHeaders('Legacy subject ID').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Legacy order ID').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('First name').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Last name').should('be.visible')
        // TODO: Integrity name isn't currently in the datastore. Work is being done to add this.
        // orderDetailsPage.deviceWearerRowHeaders('Integrity name').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Alias').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Date of birth').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Adult/child').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Legacy sex').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Contact').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Primary address').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Phone/mobile number').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('PPO').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('MAPPA').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Technical bail').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Manual risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Offence risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Postcode risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('False limb risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Migrated risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Range risk').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Report risk').should('be.visible')
      })
    })

    it('Displays the address in a single cell as a multiline value', () => {
      const orderDetailsPage = Page.verifyOnPage(OrderDetailsPage)
      const primaryAddressCell = orderDetailsPage.tableCell('Primary address').next()

      primaryAddressCell.should(
        'contain',
        'Address line 1\n        Address line 2\n        Address line 3\n        Postcode',
      )
    })
  })

  describe('Order data table', () => {
    it('Renders', () => {
      const orderDetailsPage = Page.verifyOnPage(OrderDetailsPage)
      orderDetailsPage.orderTable().should('be.visible')
    })

    it('Includes expected row headers', () => {
      const orderDetailsPage = Page.verifyOnPage(OrderDetailsPage)

      orderDetailsPage.deviceWearerTable().each(() => {
        orderDetailsPage.deviceWearerRowHeaders('Order start date').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Order end date').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Order type').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Order type description').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Order type detail').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Wearing wrist PID').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Notifying organisation name').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Responsible organisation').should('be.visible')
        orderDetailsPage.deviceWearerRowHeaders('Responsible organisation region').should('be.visible')
      })
    })
  })
})
