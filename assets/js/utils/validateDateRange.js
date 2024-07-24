import { validateDate } from './validateDate.js'

function validateDateRange(startDateInputs, endDateInputs) {
  const startDate = validateDate(startDateInputs)
  const endDate = validateDate(endDateInputs)

  const dateRange = {
    startDate: startDate.date,
    endDate: endDate.date,
    error: null,
    errorFields: null,
  }

  if (startDate.error) {
    dateRange.error = startDate.error
    dateRange.errorFields = startDate.errorFields.map(field => `start-date-${field}`)
  } else if (endDate.error) {
    dateRange.error = endDate.error
    dateRange.errorFields = endDate.errorFields.map(field => `end-date-${field}`)
  } else if (startDate.dateString && endDate.dateString && startDate.dateString > endDate.dateString) {
    dateRange.error = 'The start date must be the same as or after the end date'
    dateRange.errorFields = [
      'start-date-day',
      'start-date-month',
      'start-date-year',
      'end-date-day',
      'end-date-month',
      'end-date-year',
    ]
  }

  return dateRange
}

export { validateDateRange }
