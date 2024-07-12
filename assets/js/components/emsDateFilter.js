function init() {
  const emsDateFilters = document.getElementsByClassName('ems-date-filter')

  for (let dateFilter of emsDateFilters) {
    const applyFilter = () => {
      // Get the start and end dates
      const startDate = dateFilter.querySelector('[name="startDate"]').value
      const endDate = dateFilter.querySelector('[name="endDate"]').value

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
