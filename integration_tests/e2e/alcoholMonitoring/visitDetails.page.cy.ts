import Page from '../../pages/page'

import AlcoholMonitoringVisitDetailsPage from '../../pages/alcoholMonitoring/visitDetails'
import AlcoholMonitoringOrderSummaryPage from '../../pages/alcoholMonitoring/summary'

import { AlcoholMonitoringVisitDetails } from '../../../server/models/alcoholMonitoring/visitDetails'

context('Alcohol Monitoring Visit Details', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.signIn()
  })

  describe('General page content', () => {
    beforeEach(() => {
      cy.task('stubAlcoholMonitoringGetVisitDetails', {
        httpStatus: 200,
        legacySubjectId,
      })
    })

    it('can see their user name', () => {
      const page = Page.visit(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })
      page.header.userName.contains('M. Tester')
    })

    it('Can see the phase banner', () => {
      const page = Page.visit(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })
      page.header.phaseBanner.contains('DEV')
    })

    it('Can see service information', () => {
      const page = Page.visit(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })
      page.serviceInformation.should('exist')
    })

    it('Can go back to the summary page', () => {
      cy.task('stubAlcoholMonitoringGetOrderSummary', {
        httpStatus: 200,
        legacySubjectId,
      })

      const page = Page.visit(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })

      page.backButton.click()
      Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage)
    })

    it('Is accessible', () => {
      const page = Page.visit(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })
      page.checkIsAccessible()
    })
  })

  describe('Timeline of visit details', () => {
    it('Renders a timeline', () => {
      cy.task('stubAlcoholMonitoringGetVisitDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR123',
            legacyOrderId: 'OMR321',
            visitId: '300',
            visitType: 'TEST_VISIT_TYPE',
            visitAttempt: 'attempt 1',
            dateVisitRaised: '2001-01-01T00:00:00',
            visitAddress: 'address line 1 address line 2 address line 3 postcode',
            visitNotes: 'TEST_NOTES',
            visitOutcome: 'TEST_OUTCOME',
            actualWorkStartDateTime: '2002-02-02T01:01:01',
            actualWorkEndDateTime: '2002-02-02T02:02:02',
            visitRejectionReason: 'rejection reason',
            visitRejectionDescription: 'rejection description',
            visitCancelReason: 'cancel reason',
            visitCancelDescription: 'cancel description',
          } as AlcoholMonitoringVisitDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })
      page.timeline.shouldBeVisible()
    })

    it('First item includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetVisitDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            legacyOrderId: 'OMR123',
            visitId: '301',
            visitType: 'TEST_VISIT_TYPE',
            visitAttempt: 'attempt 2',
            dateVisitRaised: '2001-01-01T00:00:00',
            visitAddress: 'address line 1 address line 2 address line 3 postcode',
            visitNotes: 'TEST_NOTES',
            visitOutcome: 'TEST_OUTCOME',
            actualWorkStartDateTime: '2002-02-02T01:01:01',
            actualWorkEndDateTime: '2002-02-02T02:02:02',
            visitRejectionReason: 'rejection reason',
            visitRejectionDescription: 'rejection description',
            visitCancelReason: 'cancel reason',
            visitCancelDescription: 'cancel description',
          } as AlcoholMonitoringVisitDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })

      page.timeline.item(0).shouldHaveTitle('TEST_VISIT_TYPE')
      page.timeline.item(0).shouldHaveDate('1 Jan 2001 at 12am')
      page.timeline.item(0).description.shouldHaveItem('Visit ID', '301')
      page.timeline.item(0).description.shouldHaveItem('Visit types', 'TEST_VISIT_TYPE')
      page.timeline.item(0).description.shouldHaveItem('Visit attempt', 'attempt 2')
      page.timeline.item(0).description.shouldHaveItem('Date visit raised', '1 January 2001')
      page.timeline
        .item(0)
        .description.shouldHaveItem('Visit address', 'address line 1 address line 2 address line 3 postcode')
      page.timeline.item(0).description.shouldHaveItem('Vist notes', 'TEST_NOTES')
      page.timeline.item(0).description.shouldHaveItem('Visit outcome', 'TEST_OUTCOME')
      page.timeline.item(0).description.shouldHaveItem('Actual work start datetime', '2 February 2002 at 1:01am')
      page.timeline.item(0).description.shouldHaveItem('Actual work end datetime', '2 February 2002 at 2:02am')
      page.timeline.item(0).description.shouldHaveItem('Visit rejection reason', 'rejection reason')
      page.timeline.item(0).description.shouldHaveItem('Visit rejection description', 'rejection description')
      page.timeline.item(0).description.shouldHaveItem('Visit cancel reason', 'cancel reason')
      page.timeline.item(0).description.shouldHaveItem('Visit cancel description', 'cancel description')
    })

    it('Second item includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetVisitDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            legacyOrderId: 'OMR123',
            visitId: '302',
            visitType: 'TEST_VISIT_TYPE',
            visitAttempt: 'attempt 3',
            dateVisitRaised: '2001-01-01T00:00:00',
            visitAddress: 'address line 1 address line 2 address line 3 postcode',
            visitNotes: 'TEST_NOTES',
            visitOutcome: 'TEST_OUTCOME',
            actualWorkStartDateTime: '2002-02-02T01:01:01',
            actualWorkEndDateTime: '2002-02-02T02:02:02',
            visitRejectionReason: 'rejection reason',
            visitRejectionDescription: 'rejection description',
            visitCancelReason: 'cancel reason',
            visitCancelDescription: 'cancel description',
          } as AlcoholMonitoringVisitDetails,
          {
            legacySubjectId: 'AAMR321',
            legacyOrderId: 'OMR123',
            visitId: '303',
            visitType: 'TEST_VISIT_TYPE',
            visitAttempt: 'attempt 4',
            dateVisitRaised: '2001-01-01T00:00:00',
            visitAddress: 'address line 1 address line 2 address line 3 postcode',
            visitNotes: 'TEST_NOTES',
            visitOutcome: 'TEST_OUTCOME',
            actualWorkStartDateTime: '2002-02-02T01:01:01',
            actualWorkEndDateTime: '2002-02-02T02:02:02',
            visitRejectionReason: 'rejection reason',
            visitRejectionDescription: 'rejection description',
            visitCancelReason: 'cancel reason',
            visitCancelDescription: 'cancel description',
          } as AlcoholMonitoringVisitDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })
      page.timeline.item(0).shouldBeVisible()

      page.timeline.item(1).shouldHaveTitle('TEST_VISIT_TYPE')
      page.timeline.item(1).shouldHaveDate('1 Jan 2001 at 12am')
      page.timeline.item(1).description.shouldHaveItem('Visit ID', '303')
      page.timeline.item(1).description.shouldHaveItem('Visit types', 'TEST_VISIT_TYPE')
      page.timeline.item(1).description.shouldHaveItem('Visit attempt', 'attempt 4')
      page.timeline.item(1).description.shouldHaveItem('Date visit raised', '1 January 2001')
      page.timeline
        .item(1)
        .description.shouldHaveItem('Visit address', 'address line 1 address line 2 address line 3 postcode')
      page.timeline.item(1).description.shouldHaveItem('Vist notes', 'TEST_NOTES')
      page.timeline.item(1).description.shouldHaveItem('Visit outcome', 'TEST_OUTCOME')
      page.timeline.item(0).description.shouldHaveItem('Actual work start datetime', '2 February 2002 at 1:01am')
      page.timeline.item(1).description.shouldHaveItem('Actual work end datetime', '2 February 2002 at 2:02am')
      page.timeline.item(1).description.shouldHaveItem('Visit rejection reason', 'rejection reason')
      page.timeline.item(1).description.shouldHaveItem('Visit rejection description', 'rejection description')
      page.timeline.item(1).description.shouldHaveItem('Visit cancel reason', 'cancel reason')
      page.timeline.item(1).description.shouldHaveItem('Visit cancel description', 'cancel description')
    })

    it('Details can be empty and still display', () => {
      cy.task('stubAlcoholMonitoringGetVisitDetails', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            legacyOrderId: 'OMR123',
          } as AlcoholMonitoringVisitDetails,
        ],
      })

      const page = Page.visit(AlcoholMonitoringVisitDetailsPage, { legacySubjectId })

      page.timeline.shouldHaveCount(1)
      page.timeline.item(0).shouldBeVisible()
    })
  })
})
