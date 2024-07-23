import { validateDate } from './validateDate.js'

function validateDateRange(startDateInputs, endDateInputs) {
  const dateRange = {
    startDate: validateDate(startDateInputs),
    endDate: validateDate(endDateInputs),
    error: null,
  }

  if (
    dateRange.startDate.dateString &&
    dateRange.endDate.dateString &&
    dateRange.startDate.dateString > dateRange.endDate.dateString
  ) {
    dateRange.error = 'The start date must be the same as or after the end date'
  }

  return dateRange
}

export { validateDateRange }
