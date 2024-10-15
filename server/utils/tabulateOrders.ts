import { Order } from '../interfaces/order'

const tabluateOrders = (orders: Order[]) => {
  const orderSummaryUrl: string = '/orders/summary'

  return orders.map(order => {
    return [
      {
        attributes: {
          'data-sort-value': order.subjectId,
        },
        html: `
          <a href="${orderSummaryUrl}">
            ${order.subjectId}
          </a>
        `,
      },
      {
        attributes: {
          'data-sort-value': order.name,
        },
        html: `
          <p>${order.name}</p>
          ${order.alias ? `</p>Alias: ${order.alias}</p>` : ''}
        `,
      },
      {
        text: order.dateOfBirth,
        attributes: {
          'data-sort-value':
            order.dateOfBirth.split('-')[2] + order.dateOfBirth.split('-')[1] + order.dateOfBirth.split('-')[0],
        },
      },
      {
        text: order.orderStartDate,
        attributes: {
          'data-sort-value':
            order.orderStartDate.split('-')[2] +
            order.orderStartDate.split('-')[1] +
            order.orderStartDate.split('-')[0],
        },
        classes: 'govuk-table__cell--numeric',
      },
    ]
  })
}

export default tabluateOrders
