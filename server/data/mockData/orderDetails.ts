import { OrderDetails } from '../../interfaces/orderDetails'

const orderDetails: OrderDetails = {
  keyOrderDetails: {
    legacy_subject_id: '1234567',
    name: 'John Smith',
    alias: 'Zeno',
    date_of_birth: '01-02-1980',
    postcode: 'ABC 123',
    address_1: '1 Primary Street',
    address_2: 'Sutton',
    address_3: 'London',
    tag_type: 'Alcohol tag',
    start_date: '01-02-2012',
    end_date: '03-04-2013',
  },
  subjectHistoryReport: {
    report_url: '#',
    name: '1234567',
    created_on: '01-02-2020',
    time: '0900',
  },
  reports: {
    back: '#',
    order_details: '#',
    visits_and_tasks: '#',
    event_hsitory: '#',
    equipment_details: '#',
    curfew_hours: '#',
    curfew_violations: '#',
    contact_history: '#',
    suspensions: '#',
  },
  documents: {
    pageSize: 5,
    orderDocuments: [
      {
        name: 'Document 1',
        url: '#',
        created_on: '01-02-2020',
        time: '0100',
        notes:
          'Order 1 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 2',
        url: '#',
        created_on: '21-09-2017',
        time: '0200',
        notes:
          'Order 2 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 3',
        url: '#',
        created_on: '08-04-2021',
        time: '0300',
        notes:
          'Order 3 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 4',
        url: '#',
        created_on: '09-12-2015',
        time: '0400',
        notes:
          'Order 4 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 5',
        url: '#',
        created_on: '04-09-2011',
        time: '1300',
        notes:
          'Order 5 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 6',
        url: '#',
        created_on: '09-12-2001',
        time: '0500',
        notes:
          'Order 6 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 7',
        url: '#',
        created_on: '09-12-2008',
        time: '0600',
        notes:
          'Order 7 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 8',
        url: '#',
        created_on: '09-12-2011',
        time: '0700',
        notes:
          'Order 8 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 9',
        url: '#',
        created_on: '09-12-2012',
        time: '0800',
        notes:
          'Order 9 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 10',
        url: '#',
        created_on: '09-12-2002',
        time: '0900',
        notes:
          'Order 10 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 11',
        url: '#',
        created_on: '09-12-2007',
        time: '1400',
        notes:
          'Order 11 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 12',
        url: '#',
        created_on: '09-12-2006',
        time: '1000',
        notes:
          'Order 12 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 13',
        url: '#',
        created_on: '09-12-2005',
        time: '1100',
        notes:
          'Order 13 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 14',
        url: '#',
        created_on: '09-12-2003',
        time: '1200',
        notes:
          'Order 14 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
    ],
  },
}

export default orderDetails
