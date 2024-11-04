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

  describe('Order details table', () => {
    it('Includes expected column headers', () => {
      const orderDetailsPage = Page.verifyOnPage(OrderDetailsPage)

      orderDetailsPage.orderDetailsTable().each(() => {
        orderDetailsPage.orderDetailsColumnHeaders('Data title').should('be.visible')
        orderDetailsPage.orderDetailsColumnHeaders('Data').should('be.visible')
      })
    })

    it('Includes expected row headers', () => {
      const orderDetailsPage = Page.verifyOnPage(OrderDetailsPage)

      orderDetailsPage.orderDetailsTable().each(() => {
        orderDetailsPage.orderDetailsRowHeaders('MAPPA').should('be.visible')
        orderDetailsPage.orderDetailsRowHeaders('PPO').should('be.visible')
        orderDetailsPage.orderDetailsRowHeaders('AgeCatNow').should('be.visible')
        orderDetailsPage.orderDetailsRowHeaders('AliasName').should('be.visible')
      })
    })
  })
})
