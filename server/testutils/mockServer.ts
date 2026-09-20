import nock, { RequestBodyMatcher } from 'nock'

export class MockServer {
  private readonly request: nock.Scope

  constructor(readonly url: string) {
    this.request = nock(this.url)
  }

  withMockedGetResponse(path: string, expectedResult?: nock.Body) {
    this.request.get(path).matchHeader('authorization', 'Bearer test-system-token').reply(200, expectedResult)
  }

  withMockedPostResponse(path: string, data: RequestBodyMatcher, expectedResult?: nock.Body) {
    this.request.post(path, data).matchHeader('authorization', 'Bearer test-system-token').reply(200, expectedResult)
  }

  withMockedAuthErrorGetResponse(path: string, expectedResult?: nock.Body) {
    this.request.get(path).matchHeader('authorization', 'Bearer test-system-token').reply(401, expectedResult)
  }

  withMockedAuthErrorPostResponse(path: string, data: RequestBodyMatcher) {
    this.request.post(path, data).matchHeader('authorization', 'Bearer test-system-token').reply(401)
  }

  withMockedServerErrorGetResponse(path: string, expectedResult?: nock.Body) {
    this.request.get(path).matchHeader('authorization', 'Bearer test-system-token').reply(500, expectedResult).persist()
  }

  withMockedServerErrorPostResponse(path: string, data: RequestBodyMatcher) {
    this.request.post(path, data).matchHeader('authorization', 'Bearer test-system-token').reply(500).persist()
  }

  clearMocks() {
    nock.cleanAll()
  }
}

export default MockServer
