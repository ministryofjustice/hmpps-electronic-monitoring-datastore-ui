/* eslint-disable import/first */
/*
 * Import from '..' (server/data/index.ts) fails if applicationInfo not mocked first. This is
 * because paths in it differ between running app (in 'dist') and where ts-jest runs.
 */
import type { ApplicationInfo } from '../../applicationInfo'

const testAppInfo: ApplicationInfo = {
  applicationName: 'test',
  buildNumber: '1',
  gitRef: 'long ref',
  gitShortHash: 'short ref',
  productId: 'XX1234',
  branchName: 'main',
}

jest.mock('../../applicationInfo', () => {
  return jest.fn(() => testAppInfo)
})

import { EmDatastoreApiClient } from '..'

jest.mock('..')

const createMockEmDatastoreApiClient = () => new EmDatastoreApiClient() as jest.Mocked<EmDatastoreApiClient>
export default createMockEmDatastoreApiClient
