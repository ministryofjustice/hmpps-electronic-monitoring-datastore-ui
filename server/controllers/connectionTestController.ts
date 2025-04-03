import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, EmDatastoreConnectionService } from '../services'

export default class ConnectionTestController {
  constructor(
    private readonly auditService: AuditService,
    private readonly emDatastoreConnectionService: EmDatastoreConnectionService,
  ) {}

  testConnection: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.TEST_CONNECTION_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { token } = res.locals.user
    const apiResult: JSON = await this.emDatastoreConnectionService.test(token)
    const viewModel = { data: apiResult }
    res.render('pages/apiTest', viewModel)
  }
}
