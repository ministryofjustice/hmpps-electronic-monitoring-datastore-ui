import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../../../services/auditService'
import { AuditService, EmDatastoreOrderDetailsService } from '../../../services'

export default class OrderDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly emDatastoreOrderDetailsService: EmDatastoreOrderDetailsService,
  ) {}

  orderDetails: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.ORDER_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const { legacySubjectId } = req.params

    const orderDetails = await this.emDatastoreOrderDetailsService.getOrderDetails({
      userToken: res.locals.user.token,
      legacySubjectId,
    })

    res.render('pages/integrity/details', {
      legacySubjectId,
      backUrl: `/integrity/${legacySubjectId}`,
      details: orderDetails,
    })
  }
}
