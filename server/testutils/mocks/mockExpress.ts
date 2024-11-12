import type { Request, Response } from 'express'

export const createMockRequest = (): Request => {
  return {
    // @ts-expect-error stubbing session
    session: {},
    query: {},
    params: {},
    user: {
      username: '',
      token: '',
      authSource: '',
    },
  }
}

export const createMockResponse = (): Response => {
  // @ts-expect-error stubbing res.render
  return {
    locals: {
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'nomis',
        userId: 'fakeId',
        name: 'fake user',
        displayName: 'fuser',
        userRoles: ['fakeRole'],
        staffId: 123,
      },
    },
    redirect: jest.fn(),
    render: jest.fn(),
    set: jest.fn(),
    send: jest.fn(),
  }
}