import type { Request, Response } from 'express'

import auditPageViewRequest from './auditPageViewRequest'
import { Services } from '../services'
import { Page } from '../constants/pages'

jest.mock('../services')

describe('auditPageViewRequest', () => {
  const logPageView = jest.fn()
  const next = jest.fn()

  const services = {
    applicationInfo: { gitRef: 'abc1234' },
    auditService: { logPageView },
  } as unknown as Services

  const req = { id: 'request123', body: { searchTerm: 'X123456' } } as unknown as Request

  const res = {
    locals: {
      user: { username: 'user1', userRoles: ['ROLE_EXAMPLE'] },
    },
  } as unknown as Response

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('logs an audit event with details from the request and user', async () => {
    await auditPageViewRequest({ services, page: Page.START })(req, res, next)

    expect(logPageView).toHaveBeenCalledWith(Page.START, {
      correlationId: 'request123',
      who: 'user1',
    })
  })

  it('calls next after logging the audit event', async () => {
    await auditPageViewRequest({ services, page: Page.START })(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
