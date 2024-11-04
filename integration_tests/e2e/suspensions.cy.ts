import SuspensionsPage from '../pages/suspensions'
import Page from '../pages/page'

context('Suspensions', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/suspensions`)
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
          suspensions.suspensionsTableColumnHeaders('Data title').should('be.visible')
          suspensions.suspensionsTableColumnHeaders('Data').should('be.visible')
        })
      })
    })

    it('Includes expected row headers', () => {
      const suspensions = Page.verifyOnPage(SuspensionsPage)
      suspensions.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          suspensions.suspensionsTableRowHeaders('StartDate').should('be.visible')
          suspensions.suspensionsTableRowHeaders('StartTime').should('be.visible')
          // Add row headers here when finalised.
        })
      })
    })
  })
})
