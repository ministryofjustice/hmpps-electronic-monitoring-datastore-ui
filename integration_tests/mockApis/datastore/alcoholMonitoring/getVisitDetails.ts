import { SuperAgentRequest } from 'superagent'
import { stubFor } from '../../wiremock'
import { AlcoholMonitoringVisitDetails } from '../../../../server/data/models/alcoholMonitoringVisitDetails'

const defaultVisitDetails: AlcoholMonitoringVisitDetails = {
  legacySubjectId: 'AAMR1234567',
  visitId: '300',
  visitType: 'visit type',
  visitAttempt: 'attempt 1',
  dateVisitRaised: '2001-01-01T00:00:00',
  visitAddress: 'test visit address',
  visitNotes: 'visit notes',
  visitOutcome: 'visit outcome',
  actualWorkStartDateTime: '2002-02-02T02:20:20',
  actualWorkEndDateTime: '2003-03-03T03:30:30',
  visitRejectionReason: 'rejection reason',
  visitRejectionDescription: 'rejection description',
  visitCancelReason: 'cancel reason',
  visitCancelDescription: 'cancel description',
}

type GetVisitDetailsStubOptions = {
  httpStatus: number
  legacySubjectId: string
  body?: AlcoholMonitoringVisitDetails[]
}

export const stubAlcoholMonitoringGetVisitDetails = (options: GetVisitDetailsStubOptions): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      url: `/datastore/orders/alcohol-monitoring/${options.legacySubjectId}/visit-details`,
    },
    response: {
      status: options.httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody:
        options.httpStatus === 200
          ? options.body || [
              {
                ...defaultVisitDetails,
                legacySubjectId: options.legacySubjectId,
              },
            ]
          : [],
    },
  })

export default stubAlcoholMonitoringGetVisitDetails
