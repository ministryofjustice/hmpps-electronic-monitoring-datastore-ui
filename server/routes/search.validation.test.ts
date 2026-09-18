import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../constants/paths'
import { appWithAllRoutes, flashProvider, user } from './testutils/appSetup'

import IntegrityDatastoreClient from '../data/integrityDatastoreClient'

import EmDatastoreOrderSearchService from '../services/emDatastoreOrderSearchService'
import { QueryExecutionResponse } from '../models/queryExecutionResponse'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../services/emDatastoreOrderSearchService')
jest.mock('../services/emDatastoreConnectionService')

const auditService = new AuditService(undefined) as jest.Mocked<AuditService>
const emDatastoreOrderSearchService = new EmDatastoreOrderSearchService(
  {} as IntegrityDatastoreClient,
) as jest.Mocked<EmDatastoreOrderSearchService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      emDatastoreOrderSearchService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Order details search request validation', () => {
  it(`Adds validation errors for a search request with no searchType`, async () => {
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue({} as QueryExecutionResponse)

    return request(app)
      .post(paths.SEARCH)
      .send({})
      .expect('Content-Type', /text\/plain/)
      .expect(302)
      .expect('Location', paths.SEARCH)
      .expect(_res => {
        expect(flashProvider).toHaveBeenCalledWith('formData', {})
        expect(flashProvider).toHaveBeenCalledWith('validationErrors', [
          JSON.stringify({
            error: 'You must enter a value into at least one search field',
            field: '',
          }),
        ])
      })
  })

  it(`redirects back to the order search page for a search request with no data`, async () => {
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue({} as QueryExecutionResponse)

    return request(app)
      .post(paths.SEARCH)
      .send({})
      .expect(302)
      .expect('Location', paths.SEARCH)
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).not.toHaveBeenCalled()
      })
  })

  it(`redirects back to the order search page for a search request with invalid data`, async () => {
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue({} as QueryExecutionResponse)

    return request(app)
      .post(paths.SEARCH)
      .send({
        searchType: 'integrity',
        firstName: 9,
      })
      .expect(302)
      .expect('Location', paths.SEARCH)
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).not.toHaveBeenCalled()
      })
  })

  // This will need to be done in cypress
  it('renders page with validation errors and form data', async () => {
    flashProvider.mockImplementationOnce(() => [
      JSON.stringify({
        error: 'First name must consist of letters only',
        field: 'firstName',
      }),
      JSON.stringify({
        error: 'Invalid date format',
        field: 'dateOfBirth',
      }),
    ])
    flashProvider.mockImplementationOnce(() => {})

    return request(app)
      .get(`${paths.SEARCH}`)
      .send({
        searchType: 'alcohol-monitoring',
        firstName: 'John',
      })
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .expect(_res => {
        expect(_res.text).toContain('First name must consist of letters only')
        expect(_res.text).toContain('Invalid date format')
      })
  })
})
