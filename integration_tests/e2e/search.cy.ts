import SearchPage from '../pages/search'
import Page from '../pages/page'

context('Search', () => {
  beforeEach(() => {
    // cy.task('reset')
    // cy.task('stubSignIn')
    cy.visit('/search')
  })

  describe('Subject ID field', () => {
    it('Subject ID field renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.subjectIdField().should('be.visible')
      // searchPage.headerUserName().should('contain.text', 'J. Smith')
    })

    it('Subject ID label renders', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.subjectIdLabel().should('be.visible')
      searchPage.subjectIdLabel().should('be.visible')
      // searchPage.headerUserName().should('contain.text', 'J. Smith')
    })

    it('Subject ID label text is correct', () => {
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.subjectIdLabel().should('contain', 'Subject ID')
      // searchPage.headerUserName().should('contain.text', 'J. Smith')
    })
  })
})
