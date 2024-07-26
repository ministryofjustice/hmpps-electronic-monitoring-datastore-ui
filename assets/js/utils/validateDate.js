function validateDate(dateInputs) {
  const { day, month, year, dateName, isPast, isMandatory } = dateInputs

  const date = {
    dateStamp: new Date(`${year + '/' + month + '/' + day}`),
    date: null,
    error: null,
    errorFields: null,
  }

  const now = new Date().setHours(0, 0, 0, 0)

  const isNumericalString = string => string.match(/^\d+$/)

  if (!day & !month & !year && isMandatory) {
    date.error = 'Enter a date.'
    date.errorFieldss = ['day', 'month', 'year']
    return date
  } else if (!day & !month & !year) {
    date.dateStamp = null
    return date
  }

  if (isNaN(date.dateStamp)) {
    date.error = `${dateName} must be a real date.`
    date.errorFields = ['day', 'month', 'year']
    return date
  }

  if (!day) {
    date.error = 'Enter a day.'
    date.errorFields = ['day']
    return date
  }

  if (!month) {
    date.error = 'Enter a month.'
    date.errorFields = ['month']
    return date
  }

  if (!year) {
    date.error = 'Enter a year.'
    date.errorFields = ['year']
    return date
  }

  if (!isNumericalString(day) || !isNumericalString(month) || !isNumericalString(year)) {
    date.error = `${dateName} must be a real date.`
    date.errorFields = ['day', 'month', 'year']
    return date
  }

  if (year && year.length != 4) {
    date.error = `Enter a full year (eg. 2001).`
    date.errorFields = ['year']
    return date
  }

  if (isPast && date.dateStamp > now) {
    date.error = `${dateName} must be in the past.`
    date.errorFields = ['day', 'month', 'year']
    return date
  }

  const offset = date.dateStamp.getTimezoneOffset()
  const offsetDate = new Date(date.dateStamp.getTime() - offset * 60 * 1000)
  date.date = parseInt(offsetDate.toISOString().split('T')[0].replaceAll('-', ''))

  return date
}

export { validateDate }
