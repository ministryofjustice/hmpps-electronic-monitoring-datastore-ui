import OrderSummaryPage from '../pages/orderSummary'
import Page, { PageElement } from '../pages/page'

context('Order Summary', () => {
  const orderId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.visit(`/orders/${orderId}/summary`)
  })

  it('is reachable', () => {
    Page.verifyOnPage(OrderSummaryPage)
  })

  describe('Order summary table', () => {
    it('Includes expected rows', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.orderDetailsTable().each(() => {
        summaryPage.summaryTableRowHeaders('Legacy subject ID').should('be.visible')
        summaryPage.summaryTableRowHeaders('Name').should('be.visible')
        summaryPage.summaryTableRowHeaders('Alias').should('be.visible')
        summaryPage.summaryTableRowHeaders('Date of birth').should('be.visible')
        summaryPage.summaryTableRowHeaders('Postcode').should('be.visible')
        summaryPage.summaryTableRowHeaders('Tag type').should('be.visible')
        summaryPage.summaryTableRowHeaders('Start date').should('be.visible')
        summaryPage.summaryTableRowHeaders('End date').should('be.visible')
      })
    })
  })

  describe('Grid buttons', () => {
    it('Contains order details button and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.gridButton('Order details').should('be.visible')
      summaryPage.gridButton('Order details').click()
      cy.url().should('include', `/orders/${orderId}/details`)
    })

    it('Contains visits and tasks button and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.gridButton('Visits and tasks').should('be.visible')
      summaryPage.gridButton('Visits and tasks').click()
      cy.url().should('include', `/orders/${orderId}/visits-and-tasks`)
    })

    it('Contains event history button and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.gridButton('Event history').should('be.visible')
      summaryPage.gridButton('Event history').click()
      cy.url().should('include', `/orders/${orderId}/event-history`)
    })

    it('Contains equipment details button and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.gridButton('Equipment details').should('be.visible')
      summaryPage.gridButton('Equipment details').click()
      cy.url().should('include', `/orders/${orderId}/equipment-details`)
    })

    it('Contains curfew hours button and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.gridButton('Curfew hours').should('be.visible')
      summaryPage.gridButton('Curfew hours').click()
      cy.url().should('include', `/orders/${orderId}/curfew-hours`)
    })

    it('Contains curfew violations button and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.gridButton('Curfew violations').should('be.visible')
      summaryPage.gridButton('Curfew violations').click()
      cy.url().should('include', `/orders/${orderId}/curfew-violations`)
    })

    it('Contains contact history button and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.gridButton('Contact history').should('be.visible')
      summaryPage.gridButton('Contact history').click()
      cy.url().should('include', `/orders/${orderId}/contact-history`)
    })

    it('Contains suspensions button and navigates to expected page', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.gridButton('Suspensions').should('be.visible')
      summaryPage.gridButton('Suspensions').click()
      cy.url().should('include', `/orders/${orderId}/suspensions`)
    })
  })

  describe('Date filter', () => {
    it('Renders the clear filter component after typing in a date range and clicking apply', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)

      summaryPage.dateFilter().within(() => {
        // From date
        summaryPage.dateFilterRow().find('#start-date-day').type('01')
        summaryPage.dateFilterRow().find('#start-date-month').type('10')
        summaryPage.dateFilterRow().find('#start-date-year').type('2023')

        // To date
        summaryPage.dateFilterRow().find('#end-date-day').type('15')
        summaryPage.dateFilterRow().find('#end-date-month').type('10')
        summaryPage.dateFilterRow().find('#end-date-year').type('2023')

        summaryPage.applyButton().click()
        summaryPage.clearFilterLink('x clear filter').should('be.visible')
      })
    })
  })

  describe('Document tabs', () => {
    it('Contains expected tabs', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)
      summaryPage.tabsList().within(() => {
        summaryPage.documentsTab('Order documents').should('be.visible')
        summaryPage.documentsTab('Variations').should('be.visible')
        summaryPage.documentsTab('Enforcements').should('be.visible')
        summaryPage.documentsTab('Visit reports').should('be.visible')
      })
    })
  })

  describe('Document Panels', () => {
    it('Displays the correct panel when the Order Documents tab is clicked', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)

      summaryPage.tabsList().within(() => {
        summaryPage.documentsTab('Order documents').click()
      })

      summaryPage.tabsPanel('#order-documents').should('be.visible')
      summaryPage.tabsPanel('#variations').should('not.be.visible')
    })

    it('Displays the correct panel when the Variations tab is clicked', () => {
      const summaryPage = Page.verifyOnPage(OrderSummaryPage)

      summaryPage.tabsList().within(() => {
        summaryPage.documentsTab('Variations').click()
      })

      summaryPage.tabsPanel('#variations').should('be.visible')
      summaryPage.tabsPanel('#order-documents').should('not.be.visible')
    })
  })
})
