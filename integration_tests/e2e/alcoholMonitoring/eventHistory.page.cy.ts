import Page from '../../pages/page'

import AlcoholMonitoringEventHistoryPage from '../../pages/alcoholMonitoring/eventHistory'
import AlcoholMonitoringOrderSummaryPage from '../../pages/alcoholMonitoring/summary'

import {
  AlcoholMonitoringContactEvent,
  AlcoholMonitoringContactEventDetails,
} from '../../../server/models/alcoholMonitoring/contactEvents'
import {
  AlcoholMonitoringIncidentEvent,
  AlcoholMonitoringIncidentEventDetails,
} from '../../../server/models/alcoholMonitoring/incidentEvents'
import {
  AlcoholMonitoringViolationEvent,
  AlcoholMonitoringViolationEventDetails,
} from '../../../server/models/alcoholMonitoring/violationEvents'

context('Alcohol Monitoring event history', () => {
  const legacySubjectId = '1234567'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'Master Tester', roles: ['ROLE_EM_DATASTORE_GENERAL_RO'] })

    cy.signIn()
  })

  describe('General page content', () => {
    beforeEach(() => {
      cy.task('stubAlcoholMonitoringGetIncidentEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })
      cy.task('stubAlcoholMonitoringGetViolationEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })
      cy.task('stubAlcoholMonitoringGetContactEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [],
      })
    })

    it('can see their user name', () => {
      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })
      page.header.userName.contains('M. Tester')
    })

    it('Can see the phase banner', () => {
      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })
      page.header.phaseBanner.contains('DEV')
    })

    it('Can see service information', () => {
      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })
      page.serviceInformation.should('exist')
    })

    it('Can go back to the summary page', () => {
      cy.task('stubAlcoholMonitoringGetOrderSummary', {
        httpStatus: 200,
        legacySubjectId,
      })

      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

      page.backButton.click()
      Page.verifyOnPage(AlcoholMonitoringOrderSummaryPage)
    })

    it('Is accessible', () => {
      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })
      page.checkIsAccessible()
    })
  })

  describe('Timeline of events', () => {
    it('When no events are found', () => {
      cy.task('stubAlcoholMonitoringGetIncidentEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringIncidentEvent[],
      })
      cy.task('stubAlcoholMonitoringGetViolationEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringViolationEvent[],
      })
      cy.task('stubAlcoholMonitoringGetContactEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringContactEvent[],
      })

      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })
      page.timeline.shouldNotExist()

      cy.contains('No events found')
      cy.contains('No events information was found for this order')
    })

    it('First incident event includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetIncidentEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId,
            type: 'am-incident',
            dateTime: '2021-01-01T01:01:01',
            details: {
              violationAlertId: 'V001',
              violationAlertDateTime: '2021-01-01T01:01:01',
              violationAlertType: 'Test alert type',
              violationAlertResponseAction: 'Test response action',
              visitRequired: 'No',
              probationInteractionRequired: 'No',
              amsInteractionRequired: 'Yes',
              multipleAlerts: 'Yes',
              additionalAlerts: 'Test additional alerts',
            },
          },
        ] as AlcoholMonitoringIncidentEvent[],
      })
      cy.task('stubAlcoholMonitoringGetViolationEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringViolationEvent[],
      })
      cy.task('stubAlcoholMonitoringGetContactEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringContactEvent[],
      })

      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

      page.timeline.shouldHaveCount(1)

      page.timeline.item(0).shouldHaveTitle('Incident event')
      page.timeline.item(0).shouldHaveDate('1 Jan 2021 at 1:01am')

      page.timeline.item(0).description.shouldHaveItem('Violation alert type', 'Test alert type')
      page.timeline.item(0).description.shouldHaveItem('Violation alert ID', 'V001')
      page.timeline.item(0).description.shouldHaveItem('Violation alert date', '1 January 2021')
      page.timeline.item(0).description.shouldHaveItem('Violation alert time', '1:01am')
      page.timeline.item(0).description.shouldHaveItem('Violation alert response action', 'Test response action')
      page.timeline.item(0).description.shouldHaveItem('Visit required', 'No')
      page.timeline.item(0).description.shouldHaveItem('Probation interaction required', 'No')
      page.timeline.item(0).description.shouldHaveItem('AMS interaction required', 'Yes')
      page.timeline.item(0).description.shouldHaveItem('Multiple alerts', 'Yes')
      page.timeline.item(0).description.shouldHaveItem('Additional alerts', 'Test additional alerts')
    })

    it('First violation event includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetIncidentEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringIncidentEvent[],
      })
      cy.task('stubAlcoholMonitoringGetViolationEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId,
            type: 'am-violation',
            dateTime: '2022-02-02T02:02:02',
            details: {
              enforcementId: 'E001',
              nonComplianceReason: 'Test noncompliance reason',
              nonComplianceDateTime: '2022-02-02T02:02:02',
              violationAlertId: 'V001',
              violationAlertDescription: 'Test alert description',
              violationEventNotificationDateTime: '2023-03-03T03:03:03',
              actionTakenEms: 'Test action taken EMS',
              nonComplianceOutcome: 'Test outcome',
              nonComplianceResolved: 'Yes',
              dateResolved: '2024-04-04T04:04:04',
              openClosed: 'Closed',
              visitRequired: 'No',
            } as AlcoholMonitoringViolationEventDetails,
          },
        ] as AlcoholMonitoringViolationEvent[],
      })
      cy.task('stubAlcoholMonitoringGetContactEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringContactEvent[],
      })

      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

      page.timeline.shouldHaveCount(1)

      page.timeline.item(0).shouldHaveTitle('Violation event')
      page.timeline.item(0).shouldHaveDate('2 Feb 2022 at 2:02am')

      page.timeline.item(0).description.shouldHaveItem('Enforcement ID', 'E001')
      page.timeline.item(0).description.shouldHaveItem('Non-compliance reason', 'Test noncompliance reason')
      page.timeline.item(0).description.shouldHaveItem('Non-compliance date', '2 February 2022')
      page.timeline.item(0).description.shouldHaveItem('Non-compliance time', '2:02am')
      page.timeline.item(0).description.shouldHaveItem('Violation alert ID', 'V001')
      page.timeline.item(0).description.shouldHaveItem('Violation alert description', 'Test alert description')
      page.timeline.item(0).description.shouldHaveItem('Violation event notification date', '3 March 2023')
      page.timeline.item(0).description.shouldHaveItem('Violation event notification time', '3:03am')
      page.timeline.item(0).description.shouldHaveItem('Action taken EMS', 'Test action taken EMS')
      page.timeline.item(0).description.shouldHaveItem('Non-compliance outcome', 'Test outcome')
      page.timeline.item(0).description.shouldHaveItem('Non-compliance resolved', 'Yes')
      page.timeline.item(0).description.shouldHaveItem('Date resolved', '4 April 2024')
      page.timeline.item(0).description.shouldHaveItem('Open/closed', 'Closed')
      page.timeline.item(0).description.shouldHaveItem('Visit required', 'No')
    })

    it('First contact event includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetIncidentEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringIncidentEvent[],
      })
      cy.task('stubAlcoholMonitoringGetViolationEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringViolationEvent[],
      })
      cy.task('stubAlcoholMonitoringGetContactEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId,
            type: 'am-contact',
            dateTime: '2023-03-03T03:03:03',
            details: {
              contactDateTime: '2023-03-03T03:03:03',
              inboundOrOutbound: 'Inbound',
              fromTo: 'From',
              channel: 'Probation',
              subjectConsentWithdrawn: 'No',
              callOutcome: 'Test call outcome',
              statement: 'Test statement',
              reasonForContact: 'Test contact reason',
              outcomeOfContact: 'Test contact outcome',
              visitRequired: 'No ',
              visitId: 'V001',
            } as AlcoholMonitoringContactEventDetails,
          },
        ] as AlcoholMonitoringContactEvent[],
      })

      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

      page.timeline.shouldHaveCount(1)

      page.timeline.item(0).shouldHaveTitle('Contact event')
      page.timeline.item(0).shouldHaveDate('3 Mar 2023 at 3:03am')

      page.timeline.item(0).description.shouldHaveItem('Contact channel', 'Probation')
      page.timeline.item(0).description.shouldHaveItem('Contact date', '3 March 2023')
      page.timeline.item(0).description.shouldHaveItem('Contact time', '3:03am')
      page.timeline.item(0).description.shouldHaveItem('Reason for contact', 'Test contact reason')
      page.timeline.item(0).description.shouldHaveItem('Outcome of contact', 'Test contact outcome')
      page.timeline.item(0).description.shouldHaveItem('Visit ID', 'V001')
      page.timeline.item(0).description.shouldHaveItem('Visit required', 'No')
      page.timeline.item(0).description.shouldHaveItem('Inbound or outbound', 'Inbound')
      page.timeline.item(0).description.shouldHaveItem('From to', 'From')
      page.timeline.item(0).description.shouldHaveItem('Subject consent withdrawn', 'No')
      page.timeline.item(0).description.shouldHaveItem('Call outcome', 'Test call outcome')
      page.timeline.item(0).description.shouldHaveItem('Statement', 'Test statement')
    })

    it('Second incident event includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetIncidentEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            type: 'incident',
            dateTime: '2021-01-01T00:00:00',
            details: {
              violationAlertId: 'V001',
              violationAlertDateTime: '2021-01-01T01:01:01',
              violationAlertType: 'Test alert type',
              violationAlertResponseAction: 'Test response action',
              visitRequired: 'No',
              probationInteractionRequired: 'No',
              amsInteractionRequired: 'Yes',
              multipleAlerts: 'Yes',
              additionalAlerts: 'Test additional alerts',
            } as AlcoholMonitoringIncidentEventDetails,
          },
          {
            legacySubjectId,
            type: 'am-incident',
            dateTime: '2021-01-01T01:01:01',
            details: {
              violationAlertId: 'V001',
              violationAlertDateTime: '2021-01-01T01:01:01',
              violationAlertType: 'Test alert type',
              violationAlertResponseAction: 'Test response action',
              visitRequired: 'No',
              probationInteractionRequired: 'No',
              amsInteractionRequired: 'Yes',
              multipleAlerts: 'Yes',
              additionalAlerts: 'Test additional alerts',
            },
          },
        ] as AlcoholMonitoringIncidentEvent[],
      })
      cy.task('stubAlcoholMonitoringGetViolationEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringViolationEvent[],
      })
      cy.task('stubAlcoholMonitoringGetContactEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringContactEvent[],
      })

      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

      page.timeline.shouldHaveCount(2)

      page.timeline.item(1).shouldHaveTitle('Incident event')
      page.timeline.item(1).shouldHaveDate('1 Jan 2021 at 1:01am')

      page.timeline.item(1).description.shouldHaveItem('Violation alert type', 'Test alert type')
      page.timeline.item(1).description.shouldHaveItem('Violation alert ID', 'V001')
      page.timeline.item(1).description.shouldHaveItem('Violation alert date', '1 January 2021')
      page.timeline.item(1).description.shouldHaveItem('Violation alert time', '1:01am')
      page.timeline.item(1).description.shouldHaveItem('Violation alert response action', 'Test response action')
      page.timeline.item(1).description.shouldHaveItem('Visit required', 'No')
      page.timeline.item(1).description.shouldHaveItem('Probation interaction required', 'No')
      page.timeline.item(1).description.shouldHaveItem('AMS interaction required', 'Yes')
      page.timeline.item(1).description.shouldHaveItem('Multiple alerts', 'Yes')
      page.timeline.item(1).description.shouldHaveItem('Additional alerts', 'Test additional alerts')
    })

    it('Second violation event includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetIncidentEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringIncidentEvent[],
      })
      cy.task('stubAlcoholMonitoringGetViolationEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            type: 'violation',
            dateTime: '2022-02-02T00:00:00',
            details: {
              enforcementId: 'E001',
              nonComplianceReason: 'Test noncompliance reason',
              nonComplianceDateTime: '2022-02-02T02:02:02',
              violationAlertId: 'V001',
              violationAlertDescription: 'Test alert description',
              violationEventNotificationDateTime: '2023-03-03T03:03:03',
              actionTakenEms: 'Test action taken EMS',
              nonComplianceOutcome: 'Test outcome',
              nonComplianceResolved: 'Yes',
              dateResolved: '2024-04-04T04:04:04',
              openClosed: 'Closed',
              visitRequired: 'No',
            } as AlcoholMonitoringViolationEventDetails,
          },
          {
            legacySubjectId,
            type: 'am-violation',
            dateTime: '2022-02-02T02:02:02',
            details: {
              enforcementId: 'E001',
              nonComplianceReason: 'Test noncompliance reason',
              nonComplianceDateTime: '2022-02-02T02:02:02',
              violationAlertId: 'V001',
              violationAlertDescription: 'Test alert description',
              violationEventNotificationDateTime: '2023-03-03T03:03:03',
              actionTakenEms: 'Test action taken EMS',
              nonComplianceOutcome: 'Test outcome',
              nonComplianceResolved: 'Yes',
              dateResolved: '2024-04-04T04:04:04',
              openClosed: 'Closed',
              visitRequired: 'No',
            } as AlcoholMonitoringViolationEventDetails,
          },
        ] as AlcoholMonitoringViolationEvent[],
      })
      cy.task('stubAlcoholMonitoringGetContactEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringContactEvent[],
      })

      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

      page.timeline.shouldHaveCount(2)

      page.timeline.item(1).shouldHaveTitle('Violation event')
      page.timeline.item(1).shouldHaveDate('2 Feb 2022 at 2:02am')

      page.timeline.item(1).description.shouldHaveItem('Enforcement ID', 'E001')
      page.timeline.item(1).description.shouldHaveItem('Non-compliance reason', 'Test noncompliance reason')
      page.timeline.item(1).description.shouldHaveItem('Non-compliance date', '2 February 2022')
      page.timeline.item(1).description.shouldHaveItem('Non-compliance time', '2:02am')
      page.timeline.item(1).description.shouldHaveItem('Violation alert ID', 'V001')
      page.timeline.item(1).description.shouldHaveItem('Violation alert description', 'Test alert description')
      page.timeline.item(1).description.shouldHaveItem('Violation event notification date', '3 March 2023')
      page.timeline.item(1).description.shouldHaveItem('Violation event notification time', '3:03am')
      page.timeline.item(1).description.shouldHaveItem('Action taken EMS', 'Test action taken EMS')
      page.timeline.item(1).description.shouldHaveItem('Non-compliance outcome', 'Test outcome')
      page.timeline.item(1).description.shouldHaveItem('Non-compliance resolved', 'Yes')
      page.timeline.item(1).description.shouldHaveItem('Date resolved', '4 April 2024')
      page.timeline.item(1).description.shouldHaveItem('Open/closed', 'Closed')
      page.timeline.item(1).description.shouldHaveItem('Visit required', 'No')
    })

    it('Second contact event includes expected details', () => {
      cy.task('stubAlcoholMonitoringGetIncidentEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringIncidentEvent[],
      })
      cy.task('stubAlcoholMonitoringGetViolationEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [] as AlcoholMonitoringViolationEvent[],
      })
      cy.task('stubAlcoholMonitoringGetContactEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            type: 'am-contact',
            dateTime: '2023-03-03T00:00:00',
            details: {
              contactDateTime: '2023-03-03T03:03:03',
              inboundOrOutbound: 'Inbound',
              fromTo: 'From',
              channel: 'Probation',
              subjectConsentWithdrawn: 'No',
              callOutcome: 'Test call outcome',
              statement: 'Test statement',
              reasonForContact: 'Test contact reason',
              outcomeOfContact: 'Test contact outcome',
              visitRequired: 'No ',
              visitId: 'V001',
            } as AlcoholMonitoringContactEventDetails,
          },
          {
            legacySubjectId,
            type: 'am-contact',
            dateTime: '2023-03-03T03:03:03',
            details: {
              contactDateTime: '2023-03-03T03:03:03',
              inboundOrOutbound: 'Inbound',
              fromTo: 'From',
              channel: 'Probation',
              subjectConsentWithdrawn: 'No',
              callOutcome: 'Test call outcome',
              statement: 'Test statement',
              reasonForContact: 'Test contact reason',
              outcomeOfContact: 'Test contact outcome',
              visitRequired: 'No ',
              visitId: 'V001',
            } as AlcoholMonitoringContactEventDetails,
          },
        ] as AlcoholMonitoringContactEvent[],
      })

      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

      page.timeline.shouldHaveCount(2)

      page.timeline.item(1).shouldHaveTitle('Contact event')
      page.timeline.item(1).shouldHaveDate('3 Mar 2023 at 3:03am')

      page.timeline.item(1).description.shouldHaveItem('Contact channel', 'Probation')
      page.timeline.item(1).description.shouldHaveItem('Contact date', '3 March 2023')
      page.timeline.item(1).description.shouldHaveItem('Contact time', '3:03am')
      page.timeline.item(1).description.shouldHaveItem('Reason for contact', 'Test contact reason')
      page.timeline.item(1).description.shouldHaveItem('Outcome of contact', 'Test contact outcome')
      page.timeline.item(1).description.shouldHaveItem('Visit ID', 'V001')
      page.timeline.item(1).description.shouldHaveItem('Visit required', 'No')
      page.timeline.item(1).description.shouldHaveItem('Inbound or outbound', 'Inbound')
      page.timeline.item(1).description.shouldHaveItem('From to', 'From')
      page.timeline.item(1).description.shouldHaveItem('Subject consent withdrawn', 'No')
      page.timeline.item(1).description.shouldHaveItem('Call outcome', 'Test call outcome')
      page.timeline.item(1).description.shouldHaveItem('Statement', 'Test statement')
    })

    it('Details can be empty and still display', () => {
      cy.task('stubAlcoholMonitoringGetIncidentEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            type: 'incident',
            dateTime: '2021-01-01T00:00:00',
            details: {
              violationAlertId: null,
              violationAlertDateTime: null,
              violationAlertType: null,
              violationAlertResponseAction: null,
              visitRequired: null,
              probationInteractionRequired: null,
              amsInteractionRequired: null,
              multipleAlerts: null,
              additionalAlerts: null,
            } as AlcoholMonitoringIncidentEventDetails,
          },
        ] as AlcoholMonitoringIncidentEvent[],
      })
      cy.task('stubAlcoholMonitoringGetViolationEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            type: 'violation',
            dateTime: '2022-02-02T00:00:00',
            details: {
              enforcementId: null,
              nonComplianceReason: null,
              nonComplianceDateTime: null,
              violationAlertId: null,
              violationAlertDescription: null,
              violationEventNotificationDateTime: null,
              actionTakenEms: null,
              nonComplianceOutcome: null,
              nonComplianceResolved: null,
              dateResolved: null,
              openClosed: null,
              visitRequired: null,
            } as AlcoholMonitoringViolationEventDetails,
          },
        ] as AlcoholMonitoringViolationEvent[],
      })
      cy.task('stubAlcoholMonitoringGetContactEvents', {
        httpStatus: 200,
        legacySubjectId,
        body: [
          {
            legacySubjectId: 'AAMR321',
            type: 'contact',
            dateTime: '2023-03-03T00:00:00',
            details: {
              contactDateTime: null,
              inboundOrOutbound: null,
              fromTo: null,
              channel: null,
              subjectConsentWithdrawn: null,
              callOutcome: null,
              statement: null,
              reasonForContact: null,
              outcomeOfContact: null,
              visitRequired: null,
              visitId: null,
            } as AlcoholMonitoringContactEventDetails,
          },
        ] as AlcoholMonitoringContactEvent[],
      })

      const page = Page.visit(AlcoholMonitoringEventHistoryPage, { legacySubjectId })

      page.timeline.shouldHaveCount(3)
      page.timeline.item(0).shouldBeVisible()
    })
  })
})
