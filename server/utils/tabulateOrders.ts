import { Order } from '../interfaces/order'

const tabulateOrders = (orders: Order[]) => {
  return orders.map(order => {
    return [
      {
        attributes: {
          'data-sort-value': order.legacySubjectId,
        },
        html: `
          <a href="/orders/${order.legacySubjectId}/summary">
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
          'data-sort-value': `
            ${order.primaryAddressLine1}
            ${order.primaryAddressLine2}
            ${order.primaryAddressLine3}
            ${order.primaryAddressPostCode}
          `,
        },
        html: `<p>
          ${order.primaryAddressLine1 && `${order.primaryAddressLine1}<br/>`}
          ${order.primaryAddressLine2 && `${order.primaryAddressLine2}<br/>`}
          ${order.primaryAddressLine3 && `${order.primaryAddressLine3}<br/>`}
          ${order.primaryAddressPostCode}
        </p>`,
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

export default tabulateOrders
