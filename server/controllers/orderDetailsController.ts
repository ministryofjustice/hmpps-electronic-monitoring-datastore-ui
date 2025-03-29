import type { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, EmDatastoreOrderDetailsService } from '../services'
import tabulateRecords from '../utils/tabulateRecords'
import { formatOrderDetails } from '../models/orderDetails'

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

    const { orderId } = req.params

    try {
      const orderDetails = await this.emDatastoreOrderDetailsService.getOrderDetails({
        userToken: res.locals.user.token,
        orderId,
      })

      const { deviceWearerData, orderData } = formatOrderDetails.parse(orderDetails)

      const tabulatedDeviceWearerData = tabulateRecords(
        {
          backUrl: `/orders/${orderId}/summary`,
          records: deviceWearerData,
        },
        'Device wearer data',
      )

      const tabulatedOrderData = tabulateRecords(
        {
          backUrl: `/orders/${orderId}/summary`,
          records: orderData,
        },
        'Order data',
      )

      res.render('pages/order/details', {
        deviceWearer: tabulatedDeviceWearerData,
        orderDetails: tabulatedOrderData,
        backUrl: `/orders/${orderId}/summary`,
      })
    } catch {
      res.status(500).send('Error fetching data')
    }
  }
}
