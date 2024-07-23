import { validateDateRange } from '../utils/validateDateRange.js'

function init() {
  const emsDateFilters = document.getElementsByClassName('ems-date-filter')

  for (let dateFilter of emsDateFilters) {
    // Get buttons
    const filterButton = dateFilter.querySelector('.ems-date-filter__filter-button')
    const clearFiltersButton = dateFilter.querySelector('.ems-date-filter__clear-filters-button')

    // Get filter date inputs
    const startDateInputs = dateFilter.querySelector('#start-date').querySelectorAll('input')
    const endDateInputs = dateFilter.querySelector('#end-date').querySelectorAll('input')

    //Get all filterable tables within the page
    const filterableTables = document.querySelectorAll('.date-filterable')

    // Method for the filter button
    const applyFilter = () => {
      //Validate dates
      const startDate = {
        day: startDateInputs[0].value,
        month: startDateInputs[1].value,
        year: startDateInputs[2].value,
        dateName: 'Start date',
        isPast: true,
        isMandatory: false,
      }

      const endDate = {
        day: endDateInputs[0].value,
        month: endDateInputs[1].value,
        year: endDateInputs[2].value,
        dateName: 'End date',
        isPast: false,
        isMandatory: false,
      }

      const {
        startDate: validatedStartDate,
        endDate: validatedEndDate,
        error: dateRangeError,
      } = validateDateRange(startDate, endDate)

      // If there are validation errors, display error styles & messages.
      if (validatedStartDate.error || validatedEndDate.error || dateRangeError) {
        console.log('Date validation failed. Filter was not applied.')
        console.log(
          validatedStartDate.error ? 'Start date error: ' + validatedStartDate.error : 'No error in start date.',
        )
        console.log(validatedEndDate.error ? 'End date error: ' + validatedEndDate.error : 'No error in end date.')
        console.log(dateRangeError ? 'Date range error: ' + dateRangeError : 'No error in date range.')
      } else {
        // Filter the records if there are no validation errors.
        for (let table of filterableTables) {
          const rows = table.querySelectorAll('[data-filter-date]')

          for (let row of rows) {
            const filterDate = parseInt(row.dataset.filterDate)
            const startDate = validatedStartDate.dateString
            const endDate = validatedEndDate.dateString

            if ((startDate == null || filterDate > startDate) && (endDate == null || filterDate < endDate)) {
              row.classList.remove('filter-active')
            } else {
              row.classList.add('filter-active')
            }
          }

          // If any records are filtered out, show the clear filters button
          if (table.querySelectorAll('.filter-active').length) {
            clearFiltersButton.classList.remove('hidden')
          } else {
            clearFiltersButton.classList.add('hidden')
          }

          // Invoke the table's pagination, returning it to page 1 and refreshing the results table.
          table.getElementsByClassName('moj-pagination__item--link')[0].click()
        }
      }
    }

    // Method for the clear filters button
    const clearFilters = () => {
      for (let dateInput of startDateInputs) {
        dateInput.value = ''
      }
      for (let dateInput of endDateInputs) {
        dateInput.value = ''
      }
    }

    // Initialise the filter button
    filterButton.addEventListener('click', function (event) {
      event.preventDefault()
      applyFilter()
    })

    // Initialise the clear filters button
    clearFiltersButton.addEventListener('click', function (event) {
      event.preventDefault()
      clearFilters()
      applyFilter()
      return false
    })
  }
}

export { init }
