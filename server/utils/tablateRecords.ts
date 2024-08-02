import { Records, TablatedRecords } from '../interfaces/records'

const tablateRecords = (records: Records): TablatedRecords => {
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
  }
}

export default tablateRecords
