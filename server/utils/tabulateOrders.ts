import { Order } from '../interfaces/order'

const tabluateOrders = (orders: Order[]) => {
  const orderInformationUrl: string = '/orders/information'

  return orders.map(order => {
    return [
      {
        attributes: {
          'data-sort-value': order.legacySubjectId,
        },
        html: `
          <a href="/orders/${order.legacySubjectId}/information">
            ${order.legacySubjectId}
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
        attributes: {
          'data-sort-value': order.address,
        },
        html: `
          <p>${order.address}</p>
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
      {
        text: order.orderEndDate,
        attributes: {
          'data-sort-value':
            order.orderEndDate.split('-')[2] + order.orderEndDate.split('-')[1] + order.orderEndDate.split('-')[0],
        },
        classes: 'govuk-table__cell--numeric',
      },
    ]
  })
}

export default tabluateOrders
