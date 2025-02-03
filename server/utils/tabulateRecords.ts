import { Records, TabulatedRecords } from '../interfaces/records'

const tabulateRecords = (records: Records, heading: string): TabulatedRecords => {
  const tabulatedRecords = records.records.map(record => [
    {
      text: record.key,
      classes: 'govuk-!-width-one-third',
    },
    {
      text: record.value,
      ...(record.html !== undefined && { html: record.html }),
    },
  ])

  return {
    backUrl: records.backUrl,
    records: tabulatedRecords,
    heading,
  }
}

export default tabulateRecords
