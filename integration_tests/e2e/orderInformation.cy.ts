import OrderInformationPage from '../pages/orderInformation'
import Page from '../pages/page'

context('Order Information', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/information`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(OrderInformationPage)
  })

  describe('Order information table', () => {
    it('Includes expected rows', () => {
      const orderInformationPage = Page.verifyOnPage(OrderInformationPage)
      orderInformationPage.orderInformationTable().each(() => {
        orderInformationPage.tableRowHeaders('Specials').should('be.visible')
        orderInformationPage.tableRowHeaders('Legacy Subject ID').should('be.visible')
        orderInformationPage.tableRowHeaders('Legacy Order ID').should('be.visible')
        orderInformationPage.tableRowHeaders('Name').should('be.visible')
        orderInformationPage.tableRowHeaders('Alias').should('be.visible')
        orderInformationPage.tableRowHeaders('Date of birth').should('be.visible')
        orderInformationPage.tableRowHeaders('Primary address').should('be.visible')
        orderInformationPage.tableRowHeaders('Order start date').should('be.visible')
        orderInformationPage.tableRowHeaders('Order end date').should('be.visible')
      })
    })
  })

  describe('Grid buttons', () => {
    it('Contains order details button and navigates to expected page', () => {
      const orderInformationPage = Page.verifyOnPage(OrderInformationPage)
      orderInformationPage.gridButton('Order details').should('be.visible')
      orderInformationPage.gridButton('Order details').click()
      cy.url().should('include', `/orders/${orderId}/details`)
    })

    it('Contains visits details button and navigates to expected page', () => {
      const orderInformationPage = Page.verifyOnPage(OrderInformationPage)
      orderInformationPage.gridButton('Visit details').should('be.visible')
      orderInformationPage.gridButton('Visit details').click()
      cy.url().should('include', `/orders/${orderId}/visit-details`)
    })

    it('Contains equipment details button and navigates to expected page', () => {
      const orderInformationPage = Page.verifyOnPage(OrderInformationPage)
      orderInformationPage.gridButton('Equipment details').should('be.visible')
      orderInformationPage.gridButton('Equipment details').click()
      cy.url().should('include', `/orders/${orderId}/equipment-details`)
    })

    it('Contains suspension of visits button and navigates to expected page', () => {
      const orderInformationPage = Page.verifyOnPage(OrderInformationPage)
      orderInformationPage.gridButton('Suspension of visits').should('be.visible')
      orderInformationPage.gridButton('Suspension of visits').click()
      cy.url().should('include', `/orders/${orderId}/suspension-of-visits`)
    })
    it('Contains all event history button and navigates to expected page', () => {
      const orderInformationPage = Page.verifyOnPage(OrderInformationPage)
      orderInformationPage.gridButton('All event history').should('be.visible')
      orderInformationPage.gridButton('All event history').click()
      cy.url().should('include', `/orders/${orderId}/event-history`)
    })
    it('Contains services button and navigates to expected page', () => {
      const orderInformationPage = Page.verifyOnPage(OrderInformationPage)
      orderInformationPage.gridButton('Services').should('be.visible')
      orderInformationPage.gridButton('Services').click()
      // TODO: change url once Sevice page is created
      cy.url().should('include', `/orders/${orderId}/event-history`)
    })
  })

  // describe('Date filter', () => {
  //   it('Renders the clear filter component after typing in a date range and clicking apply', () => {
  //     const orderInformationPage = Page.verifyOnPage(OrderInformationPage)

  //     orderInformationPage.dateFilter().within(() => {
  //       // From date
  //       orderInformationPage.dateFilterRow().find('#start-date-day').type('01')
  //       orderInformationPage.dateFilterRow().find('#start-date-month').type('10')
  //       orderInformationPage.dateFilterRow().find('#start-date-year').type('2023')

  //       // To date
  //       orderInformationPage.dateFilterRow().find('#end-date-day').type('15')
  //       orderInformationPage.dateFilterRow().find('#end-date-month').type('10')
  //       orderInformationPage.dateFilterRow().find('#end-date-year').type('2023')

  //       orderInformationPage.applyButton().click()
  //       orderInformationPage.clearFilterLink('x clear filter').should('be.visible')
  //     })
  //   })
  // })

  // describe('Document tabs', () => {
  //   it('Contains expected tabs', () => {
  //     const orderInformationPage = Page.verifyOnPage(OrderInformationPage)
  //     orderInformationPage.tabsList().within(() => {
  //       orderInformationPage.documentsTab('Order documents').should('be.visible')
  //       orderInformationPage.documentsTab('Variations').should('be.visible')
  //       orderInformationPage.documentsTab('Enforcements').should('be.visible')
  //       orderInformationPage.documentsTab('Visit reports').should('be.visible')
  //     })
  //   })
  // })

  // describe('Document Panels', () => {
  //   it('Displays the correct panel when the Order Documents tab is clicked', () => {
  //     const orderInformationPage = Page.verifyOnPage(OrderInformationPage)

  //     orderInformationPage.tabsList().within(() => {
  //       orderInformationPage.documentsTab('Order documents').click()
  //     })

  //     orderInformationPage.tabsPanel('#order-documents').should('be.visible')
  //     orderInformationPage.tabsPanel('#variations').should('not.be.visible')
  //   })

  //   it('Displays the correct panel when the Variations tab is clicked', () => {
  //     const orderInformationPage = Page.verifyOnPage(OrderInformationPage)

  //     orderInformationPage.tabsList().within(() => {
  //       orderInformationPage.documentsTab('Variations').click()
  //     })

  //     orderInformationPage.tabsPanel('#variations').should('be.visible')
  //     orderInformationPage.tabsPanel('#order-documents').should('not.be.visible')
  //   })
  // })
})
