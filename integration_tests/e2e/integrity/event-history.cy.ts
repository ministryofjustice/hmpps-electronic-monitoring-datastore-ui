import Page from '../../pages/page'
import EventHistoryPage from '../../pages/integrity/eventHistory'

context('Event history', () => {
  const legacySubjectId = 1234567

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.task('stubDatastoreGetMonitoringEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [
        {
          legacySubjectId,
          type: 'monitoring',
          dateTime: '2022-02-02T01:03:03',
          details: {
            processedDateTime: '2022-02-02T01:03:03',
          },
        },
      ],
    })

    cy.task('stubDatastoreGetIncidentEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [
        {
          legacySubjectId,
          type: 'incident',
          dateTime: '2022-02-02T01:06:06',
          details: {
            type: 'an incident occurred',
          },
        },
      ],
    })

    cy.task('stubDatastoreGetContactEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [
        {
          legacySubjectId,
          type: 'contact',
          dateTime: '2022-02-03T01:09:09',
          details: {
            outcome: 'there was an outcome',
            type: 'PHONE_CALL',
            reason: 'there was a reason',
            channel: 'TELEPHONE',
            userId: 'Test User A',
            userName: 'UID-123',
            modifiedDateTime: '2022-02-03T01:09:09',
          },
        },
      ],
    })

    cy.task('stubDatastoreGetViolationEvents', {
      httpStatus: 200,
      legacySubjectId,
      body: [
        {
          legacySubjectId,
          type: 'violation',
          dateTime: '2022-02-03T01:12:12',
          details: {
            breachDetails: 'details of breach',
            breachEnforcementOutcome: 'outcome of breach',
            breachDateTime: '2022-02-03T01:12:12',
            breachIdentifiedDateTime: '2022-02-03T01:12:12',
            breachPackRequestedDate: '2022-02-03T01:12:12',
            breachPackSentDate: '2022-02-03T01:12:12',

            authorityFirstNotifiedDateTime: '2022-02-03T01:12:12',

            agencyAction: 'action of agency',
            agencyActionDate: '2022-02-03T01:12:12',

            investigationOutcomeReason: 'invest outcome',
            enforcementReason: 'enforce reason',

            warningLetterSentDateTime: '2022-02-03T01:12:12',
            subjectLetterSentDate: '2022-02-03T01:12:12',
            summonsServedDate: '2022-02-03T01:12:12',
            hearingDate: '2022-02-03T01:12:12',
            section9Date: '2022-02-03T01:12:12',
          },
        },
      ],
    })

    cy.signIn()
  })

  it('Should display the user name visible in header', () => {
    const page = Page.visit(EventHistoryPage, { legacySubjectId })
    page.header.userName.should('contain.text', 'M. Tester')
  })

  it('Should display the phase banner in header', () => {
    const page = Page.visit(EventHistoryPage, { legacySubjectId })
    page.header.phaseBanner.should('contain.text', 'DEV')
  })

  it('Should display the back link', () => {
    const page = Page.visit(EventHistoryPage, { legacySubjectId })

    page.backButton.should('exist')
  })

  it('Should be accessible', () => {
    const page = Page.visit(EventHistoryPage, { legacySubjectId })
    page.checkIsAccessible()
  })

  describe('Event timeline component', () => {
    it('Renders an event timeline', () => {
      const eventHistory = Page.visit(EventHistoryPage, { legacySubjectId })
      eventHistory.timeline.should('be.visible')
    })
  })

  describe('Event timeline item', () => {
    it('Includes expected monitoring event', () => {
      const eventHistory = Page.visit(EventHistoryPage, { legacySubjectId })
      eventHistory.getTimelineItem(0).within($item => {
        cy.wrap($item).contains('Monitoring event 2 Feb 2022 at 1:03am')
        cy.wrap($item).contains('Processed date 2 February 2022')
        cy.wrap($item).contains('Processed time 1:03am')
      })
    })

    it('Includes expected incident event', () => {
      const eventHistory = Page.visit(EventHistoryPage, { legacySubjectId })
      eventHistory.getTimelineItem(1).within($item => {
        cy.wrap($item).contains('Incident event 2 Feb 2022 at 1:06am')
        cy.wrap($item).contains('Type an incident occurred')
      })
    })

    it('Includes expected contact event', () => {
      const eventHistory = Page.visit(EventHistoryPage, { legacySubjectId })
      eventHistory.getTimelineItem(2).within($item => {
        cy.wrap($item).contains('Contact event 3 Feb 2022 at 1:09am')

        cy.wrap($item).contains('Outcome there was an outcome')
        cy.wrap($item).contains('Contact type PHONE_CALL')
        cy.wrap($item).contains('Reason there was a reason')
        cy.wrap($item).contains('Contact channel TELEPHONE')
        cy.wrap($item).contains('User UID-123')
        cy.wrap($item).contains('Modified date 3 February 2022')
        cy.wrap($item).contains('Modified time 1:09am')
      })
    })

    it('Includes expected violation event', () => {
      const eventHistory = Page.visit(EventHistoryPage, { legacySubjectId })
      eventHistory.getTimelineItem(3).within($item => {
        cy.wrap($item).contains('Violation event 3 Feb 2022 at 1:12am')

        cy.wrap($item).contains('Breach details details of breach')
        cy.wrap($item).contains('Breach enforcement outcome outcome of breach')
        cy.wrap($item).contains('Breach date 3 February 2022')
        cy.wrap($item).contains('Breach time 1:12am')
        cy.wrap($item).contains('Breach identified date 3 February 2022')
        cy.wrap($item).contains('Breach identified time 1:12am')
        cy.wrap($item).contains('Breach pack requested date 3 February 2022')
        cy.wrap($item).contains('Breach pack sent date 3 February 2022')
        cy.wrap($item).contains('Authority first notified date 3 February 2022')
        cy.wrap($item).contains('Authority first notified time 1:12am')
        cy.wrap($item).contains('Agency action action of agency')
        cy.wrap($item).contains('Agency action date 3 February 2022')
        cy.wrap($item).contains('Investigation outcome reason invest outcome')
        cy.wrap($item).contains('Enforcement reason enforce reason')
        cy.wrap($item).contains('Warning letter sent date 3 February 2022')
        cy.wrap($item).contains('Warning letter sent time 1:12am')
        cy.wrap($item).contains('Subject letter sent date 3 February 2022')
        cy.wrap($item).contains('Summons server date 3 February 2022')
        cy.wrap($item).contains('Hearing date 3 February 2022')
        cy.wrap($item).contains('Section 9 date 3 February 2022')
      })
    })
  })
})
