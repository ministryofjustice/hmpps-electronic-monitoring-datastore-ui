import { Records } from '../../interfaces/records'

const curfewHours: Records = {
  backUrl: '/order-summary',
  records: [
    {
      key: 'ServiceStartDate',
      value: '01.01.2022',
    },
    {
      key: 'ServiceEndDate',
      value: '02.01.2022',
    },
    {
      key: 'HoursStartDate',
      value: '02.01.2022',
    },
    {
      key: 'HoursStartTime',
      value: '1100',
    },
    {
      key: 'HoursEndDate',
      value: '02.01.2022',
    },
    {
      key: 'HoursEndTime',
      value: '1200',
    },
    {
      key: 'Curfew days',
      value: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday',
    },

    {
      key: 'CurfewDuration',
      value: '2400',
    },
  ],
}

export default curfewHours
