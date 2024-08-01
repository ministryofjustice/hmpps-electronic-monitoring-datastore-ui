import { Order } from '../../interfaces/order'

const orders: Order[] = [
  {
    subject_id: 1000000,
    name: 'Amy Smith',
    alias: null,
    date_of_birth: '01-01-1970',
    order_start_date: '08-02-2019',
    order_details_url: '/order-details',
  },
  {
    subject_id: 2000000,
    name: 'Bill Smith',
    alias: 'Plato',
    date_of_birth: '01-02-1971',
    order_start_date: '03-11-2020',
    order_details_url: '/order-details',
  },
  {
    subject_id: 3000000,
    name: 'Claire Smith',
    alias: null,
    date_of_birth: '09-04-1962',
    order_start_date: '05-08-2001',
    order_details_url: '/order-details',
  },
  {
    subject_id: 8000000,
    name: 'Daniel Smith',
    alias: 'Aristotle',
    date_of_birth: '12-11-1978',
    order_start_date: '18-02-2012',
    order_details_url: '/order-details',
  },
  {
    subject_id: 30000,
    name: 'Emma Smith',
    alias: 'Socrates',
    date_of_birth: '03-03-2001',
    order_start_date: '24-01-2017',
    order_details_url: '/order-details',
  },
  {
    subject_id: 4000000,
    name: 'Fred Smith',
    alias: null,
    date_of_birth: '08-10-1980',
    order_start_date: '01-05-2021',
    order_details_url: '/order-details',
  },
]

export default orders
