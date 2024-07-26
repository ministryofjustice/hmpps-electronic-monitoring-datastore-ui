import { Order } from '../interfaces/order'

const tablateOrders = (orders: Order[]) => {
  return orders.map(order => {
    return [
      {
        attributes: {
          'data-sort-value': order.subject_id,
        },
        html: `
          <a href="${order.order_details_url}">
            ${order.subject_id}
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
        text: order.date_of_birth,
        attributes: {
          'data-sort-value':
            order.date_of_birth.split('-')[2] + order.date_of_birth.split('-')[1] + order.date_of_birth.split('-')[0],
        },
      },
      {
        text: order.order_start_date,
        attributes: {
          'data-sort-value':
            order.order_start_date.split('-')[2] +
            order.order_start_date.split('-')[1] +
            order.order_start_date.split('-')[0],
        },
        classes: 'govuk-table__cell--numeric',
      },
    ]
  })
}

export default tablateOrders
