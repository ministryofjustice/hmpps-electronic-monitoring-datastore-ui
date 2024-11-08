import OrderDetailsPage from '../pages/orderDetails'
import Page from '../pages/page'

context('Order Details', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
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
  describe('Order data table', () => {
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
