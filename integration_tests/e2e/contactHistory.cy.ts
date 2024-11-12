import ContactHistoryPage from '../pages/contactHistory'
import Page from '../pages/page'

context('Contact history', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/contact-history`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(ContactHistoryPage)
  })

  // Commenting out as this page no longer exists on its own. It will be included in the 'All event history' page.
  // describe('timeline component', () => {
  //   it('Renders an event timeline', () => {
  //     const contactHistory = Page.verifyOnPage(ContactHistoryPage)
  //     contactHistory.timeline().should('be.visible')
  //   })
  // })

  // describe('Violations timeline item', () => {
  //   it('Includes expected column headers', () => {
  //     const contactHistory = Page.verifyOnPage(ContactHistoryPage)

  //     contactHistory.timelineItems().each($item => {
  //       cy.wrap($item).within(() => {
  //         contactHistory.contactHistoryTableColumnHeaders('Type').should('be.visible')
  //         contactHistory.contactHistoryTableColumnHeaders('Details').should('be.visible')
  //       })
  //     })
  //   })

  //   it('Includes expected row headers', () => {
  //     const contactHistory = Page.verifyOnPage(ContactHistoryPage)

  //     contactHistory.timelineItems().each($item => {
  //       cy.wrap($item).within(() => {
  //         contactHistory.contactHistoryTableRowHeaders('Comments').should('be.visible')
  //         contactHistory.contactHistoryTableRowHeaders('Comment Type').should('be.visible')
  //         // Add row headers here when finalised.
  //       })
  //     })
  //   })
  // })
})
