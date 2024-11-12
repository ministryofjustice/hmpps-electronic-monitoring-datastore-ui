import SuspensionsPage from '../pages/suspensions'
import Page from '../pages/page'

context('Suspensions', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/suspension-of-visits`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(SuspensionsPage)
  })

  describe('timeline component', () => {
    it('Renders a suspensions timeline', () => {
      const suspensions = Page.verifyOnPage(SuspensionsPage)
      suspensions.timeline().should('be.visible')
    })
  })

  describe('Suspensions timeline item', () => {
    it('Includes expected column headers', () => {
      const suspensions = Page.verifyOnPage(SuspensionsPage)

      suspensions.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          suspensions.suspensionsTableColumnHeaders('Type').should('be.visible')
          suspensions.suspensionsTableColumnHeaders('Details').should('be.visible')
        })
      })
    })

    it('Includes expected row headers', () => {
      const suspensions = Page.verifyOnPage(SuspensionsPage)
      suspensions.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          suspensions.suspensionsTableRowHeaders('Suspension of Visits').should('be.visible')
          suspensions.suspensionsTableRowHeaders('Suspension of Visits Requested Date').should('be.visible')
          // Add row headers here when finalised.
        })
      })
    })
  })
})
