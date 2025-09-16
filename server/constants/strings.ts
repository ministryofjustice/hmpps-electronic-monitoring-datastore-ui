const strings: Record<string, Record<string, string>> = {
  errors: {
    invalidSubjectID: '__PLACE_HOLDER_FOR_INVALID_SUBJECT_ID__',
    invalidFirstName: 'First name must contain letters only',
    invalidLastName: 'Last name must contain letters only',
    invalidAlias: 'Alias must contain letters and spaces only',
    missingDay: 'Date of birth must include a day',
    missingMonth: 'Date of birth must include a month',
    missingYear: 'Date of birth must include a year',
    unrealDate: 'Please enter a real date in the format DD/MM/YYYY. For example, 24/10/2020',
    dateBelowLimit: 'Enter a date after 01/01/1900',
    futureDate: 'Future dates are not allowed',
  },
  errorCodesFromApi: {},
  pageHeadings: {
    searchOrderForm: 'Search for order details',
  },
}

export default strings
