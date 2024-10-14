import { Records } from '../../interfaces/records'

const visitsAndTasks: Records = {
  backUrl: '/order-summary',
  records: [
    {
      key: 'crewOnDateSID',
      value: '01.01.2022',
    },
    {
      key: 'crewOnTimeSID',
      value: '1101',
    },
    {
      key: 'crewOffDateSID',
      value: '01.01.2022',
    },
    {
      key: 'crewOffTimeSID',
      value: '1230',
    },
    {
      key: 'Comments',
      value:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi',
    },
    {
      key: 'TaskName',
      value: 'Name',
    },
    {
      key: 'OutcomeName',
      value: 'Name',
    },
    {
      key: 'OrderNo',
      value: '12345678',
    },
    {
      key: 'Duration',
      value: '5 day',
    },
  ],
}

export default visitsAndTasks
