function init() {
  const emsDateFilters = document.getElementsByClassName('ems-date-filter')

  for (let dateFilter of emsDateFilters) {
    const applyFilter = () => {
      // Get the start and end dates
      const getDateString = dateInputs => {
        return `${dateInputs[2].value + dateInputs[1].value + dateInputs[0].value}`
      }

      const startDate = getDateString(dateFilter.querySelector('#start-date').querySelectorAll('input'))
      const endDate = getDateString(dateFilter.querySelector('#end-date').querySelectorAll('input'))

      // Filter the records
      const filterableTables = document.querySelectorAll('.date-filterable')

      for (let table of filterableTables) {
        const rows = table.querySelectorAll('[data-filter-date]')

        for (let row of rows) {
          const filterDate = parseInt(row.dataset.filterDate)

          if (filterDate < startDate || filterDate >= endDate) {
            row.classList.add('filter-active')
          } else {
            row.classList.remove('filter-active')
          }
        }

        // Invoke the table's pagination, returning it to page 1 and refreshing the results table.
        table.getElementsByClassName('moj-pagination__item--link')[0].click()
      }
    }

    const filterButton = dateFilter.querySelector('.ems-date-filter__filter-button')

    filterButton.addEventListener('click', function (event) {
      event.preventDefault()
      applyFilter()
    })
  }
}

export { init }
