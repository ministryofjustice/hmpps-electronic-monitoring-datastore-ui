const strings: Record<string, Record<string, string>> = {
  errors: {
    invalidSubjectID: '__PLACE_HOLDER_FOR_INVALID_SUBJECT_ID__',
    invalidFirstName: 'First name must contain letters only',
    invalidLastName: 'Last name must contain letters only',
    invalidAlias: 'Alias must contain letters and spaces only',
    incompleteDate: 'Incomplete date provided. Please ensure day, month, and year are all filled out',
    incorrectDateFormat:
      'Date is in the incorrect format. Enter the date in the format DD/MM/YYYY (Day/Month/Year). For example, 24/10/2020.',
    futureDateNotAllowed: 'Future dates are not allowed.',
  },
  errorCodesFromApi: {},
  pageHeadings: {
    searchOrderForm: 'Search for order details',
  },
}

export default strings
