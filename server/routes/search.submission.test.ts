import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'

import { paths } from '../constants/paths'
import { appWithAllRoutes, user } from './testutils/appSetup'

import EmDatastoreOrderSearchService from '../services/emDatastoreOrderSearchService'
import { QueryExecutionResponse } from '../models/queryExecutionResponse'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../services/emDatastoreOrderSearchService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const emDatastoreOrderSearchService = new EmDatastoreOrderSearchService(
  {} as never,
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

describe('Order details search request', () => {
  it(`calls the order search service for a search request with valid data`, async () => {
    return request(app)
      .post(paths.SEARCH)
      .send({
        searchType: 'integrity',
        firstName: 'John',
      })
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).toHaveBeenCalledWith(
          'integrity',
          {
            searchType: 'integrity',
            firstName: 'John',
          },
          'token',
        )
      })
  })

  it(`assumes an integrity order search for a search request with no searchType`, async () => {
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue({} as QueryExecutionResponse)

    return request(app)
      .post(paths.SEARCH)
      .send({
        firstName: 'jon',
      })
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).toHaveBeenCalledWith(
          undefined,
          {
            searchType: 'integrity',
            firstName: 'jon',
          },
          'token',
        )
      })
  })

  it(`does not call the order search service for a search request with no data`, async () => {
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue({} as QueryExecutionResponse)

    return request(app)
      .post(paths.SEARCH)
      .send({
        searchType: 'integrity',
      })
      .expect('Content-Type', /text\/plain/)
      .expect(302)
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).not.toHaveBeenCalled()
      })
  })

  it(`does not call the order search service for a search request with invalid search type`, async () => {
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue({} as QueryExecutionResponse)

    return request(app)
      .post(paths.SEARCH)
      .send({
        searchType: 1,
        firstName: 'bar',
      })
      .expect('Content-Type', /text\/plain/)
      .expect(302)
      .expect('Location', paths.SEARCH)
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).not.toHaveBeenCalled()
      })
  })

  it(`does not call the order search service for a search request with invalid search type value`, async () => {
    const response = { queryExecutionId: 'query_execution_002' } as QueryExecutionResponse
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue(response)

    return request(app)
      .post(paths.SEARCH)
      .send({
        searchType: 'foo',
        firstName: 'bar',
      })
      .expect('Content-Type', /text\/plain/)
      .expect(302)
      .expect('Location', paths.SEARCH)
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).not.toHaveBeenCalled()
      })
  })

  it(`does not call the order search service for a search request with invalid first name`, async () => {
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue({} as QueryExecutionResponse)

    return request(app)
      .post(paths.SEARCH)
      .send({
        searchType: 'integrity',
        firstName: 1,
      })
      .expect(302)
      .expect('Location', paths.SEARCH)
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).not.toHaveBeenCalled()
      })
  })

  it(`does not call the order search service for a search request with invalid last name`, async () => {
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue({} as QueryExecutionResponse)

    return request(app)
      .post(paths.SEARCH)
      .send({
        searchType: 'integrity',
        lastName: 1,
      })
      .expect(302)
      .expect('Location', paths.SEARCH)
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).not.toHaveBeenCalled()
      })
  })

  it(`does not call the order search service for a search request with no data`, async () => {
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

  it(`redirects to the integrity results page with the correct query execution id for an integrity search request`, async () => {
    const response = { queryExecutionId: 'query_execution_003' } as QueryExecutionResponse
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue(response)

    return request(app)
      .post(paths.SEARCH)
      .send({
        searchType: 'integrity',
        firstName: 'John',
      })
      .expect('Content-Type', /text\/plain/)
      .expect(302)
      .expect('Location', `${paths.INTEGRITY_ORDER.INDEX}?search_id=query_execution_003`)
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).toHaveBeenCalled()
      })
  })

  it(`redirects to the alcohol monitoring results page with the correct query execution id for an alcohol monitoring search request`, async () => {
    const response = { queryExecutionId: 'query_execution_004' } as QueryExecutionResponse
    emDatastoreOrderSearchService.submitSearchQuery.mockResolvedValue(response)

    return request(app)
      .post(paths.SEARCH)
      .send({
        searchType: 'alcohol-monitoring',
        firstName: 'John',
      })
      .expect('Content-Type', /text\/plain/)
      .expect(302)
      .expect('Location', `${paths.ALCOHOL_MONITORING.INDEX}?search_id=query_execution_004`)
      .expect(_res => {
        expect(emDatastoreOrderSearchService.submitSearchQuery).toHaveBeenCalled()
      })
  })
})
