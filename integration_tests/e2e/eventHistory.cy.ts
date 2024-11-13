import EventHistoryPage from '../pages/eventHistory'
import Page from '../pages/page'

context('Event history', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/event-history`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(EventHistoryPage)
  })

  describe('Event timeline component', () => {
    it('Renders an event timeline', () => {
      const eventHistory = Page.verifyOnPage(EventHistoryPage)
      eventHistory.timeline().should('be.visible')
    })
  })
  // Commenting out for now until this page is worked on
  // describe('Event timeline item', () => {
  //   it('Includes expected column headers', () => {
  //     const eventHistory = Page.verifyOnPage(EventHistoryPage)

  //     eventHistory.timelineItems().each($item => {
  //       cy.wrap($item).within(() => {
  //         eventHistory.eventTableColumnHeaders('Data title').should('be.visible')
  //         eventHistory.eventTableColumnHeaders('Data').should('be.visible')
  //       })
  //     })
  //   })

  //   it('Includes expected row headers', () => {
  //     const eventHistory = Page.verifyOnPage(EventHistoryPage)
  //     eventHistory.timelineItems().each($item => {
  //       cy.wrap($item).within(() => {
  //         eventHistory.eventTableRowHeaders('EventDesc').should('be.visible')
  //         eventHistory.eventTableRowHeaders('HappenedDate').should('be.visible')
  //         // Add row headers here when finalised.
  //       })
  //     })
  //   })
  // })
})
