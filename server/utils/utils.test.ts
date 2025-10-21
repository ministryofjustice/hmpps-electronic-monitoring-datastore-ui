import { ValidationResult } from '../models/validationResult'
import { convertToTitleCase, initialiseName, getError } from './utils'

describe('convert to title case', () => {
  it.each([
    ['null', null, ''],
    ['undefined', undefined, ''],
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
    ['null', null, undefined],
    ['undefined', undefined, undefined],
    ['Empty string', '', undefined],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string | undefined, a: string | undefined, expected: string | undefined) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('getError', () => {
  it.each([
    { errors: [] as ValidationResult, field: 'field1', expected: undefined },
    {
      errors: [{ field: 'field2', error: 'Field 2 is required' }] as ValidationResult,
      field: 'field1',
      expected: undefined,
    },
    {
      errors: [{ field: 'field1', error: 'Field 1 is required' }] as ValidationResult,
      field: 'field1',
      expected: { text: 'Field 1 is required' },
    },
  ])('getError($errors, $field)', ({ errors, field, expected }) => {
    expect(getError(errors, field)).toEqual(expected)
  })
})
