import { IntegrityOrderSummary } from '../../interfaces/integrity/orderSummary'

const orderInformation: IntegrityOrderSummary = {
  keyOrderInformation: {
    specials: 'No',
    legacySubjectId: 1234567,
    name: 'John Smith',
    alias: 'Zeno',
    dateOfBirth: '01-02-1980',
    address1: '1 Primary Street',
    address2: 'Sutton',
    address3: 'London',
    postcode: 'ABC 123',
    orderStartDate: '01-02-2012',
    orderEndDate: '03-04-2013',
  },
  subjectHistoryReport: {
    reportUrl: '#',
    name: '1234567',
    createdOn: '01-02-2020',
    time: '0900',
  },
  documents: {
    pageSize: 5,
    orderDocuments: [
      {
        name: 'Document 1',
        url: '#',
        createdOn: '01-02-2020',
        time: '0100',
        notes:
          'Order 1 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 2',
        url: '#',
        createdOn: '21-09-2017',
        time: '0200',
        notes:
          'Order 2 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 3',
        url: '#',
        createdOn: '08-04-2021',
        time: '0300',
        notes:
          'Order 3 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 4',
        url: '#',
        createdOn: '09-12-2015',
        time: '0400',
        notes:
          'Order 4 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 5',
        url: '#',
        createdOn: '04-09-2011',
        time: '1300',
        notes:
          'Order 5 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 6',
        url: '#',
        createdOn: '09-12-2001',
        time: '0500',
        notes:
          'Order 6 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 7',
        url: '#',
        createdOn: '09-12-2008',
        time: '0600',
        notes:
          'Order 7 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 8',
        url: '#',
        createdOn: '09-12-2011',
        time: '0700',
        notes:
          'Order 8 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 9',
        url: '#',
        createdOn: '09-12-2012',
        time: '0800',
        notes:
          'Order 9 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 10',
        url: '#',
        createdOn: '09-12-2002',
        time: '0900',
        notes:
          'Order 10 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 11',
        url: '#',
        createdOn: '09-12-2007',
        time: '1400',
        notes:
          'Order 11 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 12',
        url: '#',
        createdOn: '09-12-2006',
        time: '1000',
        notes:
          'Order 12 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 13',
        url: '#',
        createdOn: '09-12-2005',
        time: '1100',
        notes:
          'Order 13 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
      {
        name: 'Document 14',
        url: '#',
        createdOn: '09-12-2003',
        time: '1200',
        notes:
          'Order 14 documents xxxxxx xxxxxxx NAME HDC New.msg application/octet-stream NAME - TOLD TO IGNORE AS SUBJECT STILL IN CUSTODY ABCD 12 345678 xx-xxxxxx',
      },
    ],
  },
}

export default orderInformation
