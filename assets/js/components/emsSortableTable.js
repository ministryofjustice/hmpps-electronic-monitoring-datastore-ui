function init() {
  const emsSortableTables = document.getElementsByClassName('ems-sortable-table')

  for (let table of emsSortableTables) {
    const totalRecords = table.dataset.totalrecords
    const pageSize = table.dataset.pagesize
    const totalPages = table.dataset.totalpages

    const rows = table.getElementsByClassName('govuk-table__row')
    for (let row of rows) {
      row.classList.remove('ems-ui-table--row__hidden')
      row.classList.add('ems-ui-table--row')
    }

    const paginationMenu = table.getElementsByClassName('govuk-pagination')[0]
    const paginationLinks = paginationMenu.getElementsByClassName('govuk-pagination__link')

    for (let link of paginationLinks) {
      link.classList.add('ems-ui-table--row')
      link.addEventListener('click', function (event) {
        event.preventDefault()
        console.log('Pagination button registers click')
        return false
      })
    }
  }
}

export { init }
