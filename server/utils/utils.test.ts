import { convertToTitleCase, dateParts, initialiseName, makePageTitle } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('dateParts', () => {
  it('should create correctly structured input definitions for date with given values', () => {
    const formData = {
      'dob-day': '10',
      'dob-month': '02',
      'dob-year': '2024',
    }

    const items = dateParts('dob', formData)

    expect(items).toHaveLength(3) // Checks if three items are returned

    // Check details for each input
    expect(items[0]).toEqual({
      name: 'day',
      label: 'Day',
      classes: 'govuk-input--width-2',
      attributes: {
        maxlength: 2,
      },
      value: '10',
    })

    expect(items[1]).toEqual({
      name: 'month',
      label: 'Month',
      classes: 'govuk-input--width-2',
      attributes: {
        maxlength: 2,
      },
      value: '02',
    })

    expect(items[2]).toEqual({
      name: 'year',
      label: 'Year',
      classes: 'govuk-input--width-4',
      attributes: {
        maxlength: 4,
      },
      value: '2024',
    })
  })

  it('should handle missing values correctly', () => {
    const formData = {}

    const items = dateParts('dob', formData)

    expect(items).toHaveLength(3) // Ensure three items are still returned
    expect(items[0].value).toBe('') // Checks that missing values default to an empty string
    expect(items[1].value).toBe('')
    expect(items[2].value).toBe('')
  })
})

describe('makePageTitle', () => {
  it('suffixes the supplied heading with the app name', () => {
    const title = makePageTitle({ pageHeading: 'Search for order details', hasErrors: false })
    expect(title).toEqual('Search for order details - Electronic Monitoring Datastore')
  })

  it('prefixes the title if there are errors', () => {
    const title = makePageTitle({ pageHeading: 'Search for order details', hasErrors: true })
    expect(title).toEqual('Error: Search for order details - Electronic Monitoring Datastore')
  })
})
