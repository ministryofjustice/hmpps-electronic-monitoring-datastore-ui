import SuspensionOfVisitsPage from '../pages/suspensionOfVisits'
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
    Page.verifyOnPage(SuspensionOfVisitsPage)
  })

  describe('timeline component', () => {
    it('Renders a suspensions timeline', () => {
      const suspensions = Page.verifyOnPage(SuspensionOfVisitsPage)
      suspensions.timeline().should('be.visible')
    })
  })

  describe('Suspensions timeline item', () => {
    it('Includes expected column headers', () => {
      const suspensions = Page.verifyOnPage(SuspensionOfVisitsPage)

      suspensions.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          suspensions.details().within(() => {
            // force:true added here to avoid cypress error: 'is not visible because it has an effective width and height of: 25 x 0 pixels'
            suspensions.detailsSummary().click({ force: true })
          })
          suspensions.table().within(() => {
            suspensions.suspensionsTableColumnHeaders('Type').should('be.visible')
            suspensions.suspensionsTableColumnHeaders('Details').should('be.visible')
          })
        })
      })
    })

    it('Includes expected row headers', () => {
      const suspensions = Page.verifyOnPage(SuspensionOfVisitsPage)
      suspensions.timelineItems().each($item => {
        cy.wrap($item).within(() => {
          suspensions.details().within(() => {
            // force:true added here to avoid cypress error: 'is not visible because it has an effective width and height of: 25 x 0 pixels'
            suspensions.detailsSummary().click({ force: true })
          })
          suspensions.tableBody().within(() => {
            suspensions.suspensionsTableRowHeaders('Suspension of Visits').should('be.visible')
            suspensions.suspensionsTableRowHeaders('Suspension of Visits Requested Date').should('be.visible')
            suspensions.suspensionsTableRowHeaders('Suspension of Visits Start Date').should('be.visible')
            suspensions.suspensionsTableRowHeaders('Suspension of Visits Start Time').should('be.visible')
            suspensions.suspensionsTableRowHeaders('Suspension of Visits End Date').should('be.visible')
          })
        })
      })
    })
  })
})
