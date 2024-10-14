import { Records, TabulatedRecords } from '../interfaces/records'

const tabluateRecords = (records: Records, heading: string): TabulatedRecords => {
  const tabluatedRecords = records.records.map(record => [
    {
      text: record.key,
    },
    {
      text: record.value,
    },
  ])

  return {
    backUrl: records.backUrl,
    records: tabluatedRecords,
    heading,
  }
}

export default tabluateRecords
