import { Records, TablatedRecords } from '../interfaces/records'

const tablateRecords = (records: Records, heading: string): TablatedRecords => {
  const tablatedRecords = records.records.map(record => [
    {
      text: record.key,
    },
    {
      text: record.value,
    },
  ])

  return {
    backUrl: records.backUrl,
    records: tablatedRecords,
    heading,
  }
}

export default tablateRecords
