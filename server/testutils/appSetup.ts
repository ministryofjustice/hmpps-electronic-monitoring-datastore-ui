import express, { Express } from 'express'
import { NotFound } from 'http-errors'
import { v4 as uuidv4 } from 'uuid'

import routes from '../routes/index'
import nunjucksSetup from '../utils/nunjucksSetup'
import errorHandler from '../errorHandler'
import type { Services } from '../services'
import AuditService from '../services/auditService'
import SearchService from '../services/searchService'
import OrderService from '../services/orderService'

import { HmppsUser } from '../interfaces/hmppsUser'
import setUpWebSession from '../middleware/setUpWebSession'
import { createMockHmppsAuthClient, createDatastoreClient } from '../data/testUtils/mocks'

jest.mock('../services/auditService')
jest.mock('../services/searchService')
jest.mock('../services/orderService')

const hmppsAuthClient = createMockHmppsAuthClient()
const datastoreClient = createDatastoreClient()
const datastoreClientFactory = jest.fn()
datastoreClientFactory.mockReturnValue(datastoreClient)

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

export const flashProvider = jest.fn()

function appSetup(services: Services, production: boolean, userSupplier: () => HmppsUser): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app)
  app.use(setUpWebSession())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user } as HmppsUser,
    }
    next()
  })
  app.use((req, res, next) => {
    req.id = uuidv4()
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {
    auditService: new AuditService(null) as jest.Mocked<AuditService>,
    searchService: new SearchService(datastoreClientFactory, hmppsAuthClient),
    orderService: new OrderService() as jest.Mocked<OrderService>,
  },
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => HmppsUser
}): Express {
  return appSetup(services as Services, production, userSupplier)
}
