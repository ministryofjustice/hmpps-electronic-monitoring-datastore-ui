const paginationSelector = '.moj-pagination'
const itemsSelector = '.govuk-pagination__item' // '.moj-pagination__item'
const prevItemSelector = '.govuk-pagination__prev' // '.moj-pagination__item--prev'
const nextItemSelector = '.govuk-pagination__next' // '.moj-pagination__item--next'
const ellipsisSelector = '.govuk-pagination__item--ellipsis' // '.moj-pagination__item--dots'
const paginationResultsSelector = '.moj-pagination__results' // '.moj-pagination__results'

const currentItemClassName = 'govuk-pagination__item--current' // 'moj-pagination__item--active'

export function init() {
  const emsSortableTables = document.getElementsByClassName('ems-sortable-table')

  for (const table of emsSortableTables) {
    const pageSize = parseInt(table.dataset.pageSize, 10) || 10
    let currentPage = parseInt(table.dataset.currentPage, 10) || 1
    let rows
    let totalRows
    let totalPages

    const setRowsAndPages = () => {
      const unfilteredRows = Array.from(
        table.querySelector('.govuk-table__body').getElementsByClassName('govuk-table__row'),
      )
      rows = unfilteredRows.filter(row => !row.classList.contains('filter-active'))
      totalRows = rows.length
      totalPages = Math.ceil(totalRows / pageSize)
      currentPage = currentPage <= totalPages ? currentPage : 1
    }
    setRowsAndPages()

    const displayNoRecords = () => {
      table.querySelector('.govuk-table').classList.add('hidden')
      table.querySelector('.ems-sortable-table__no-results').classList.remove('hidden')
    }
    const displayRecords = () => {
      table.querySelector('.govuk-table').classList.remove('hidden')
      table.querySelector('.ems-sortable-table__no-results').classList.add('hidden')
    }

    if (totalRows === 0) {
      displayNoRecords()
    } else {
      displayRecords()

      const pagination = table.querySelector(paginationSelector)
      const allPaginationButtons = pagination.querySelectorAll(itemsSelector)
      const prevButton = pagination.querySelector(prevItemSelector)
      const nextButton = pagination.querySelector(nextItemSelector)
      const ellipses = pagination.querySelectorAll(ellipsisSelector)
      const paginationResults = pagination.querySelector(paginationResultsSelector)

      const updateTable = () => {
        setRowsAndPages()
        const firstIndex = (currentPage - 1) * pageSize
        const lastIndex = currentPage * pageSize

        rows.forEach((row, index) => {
          if (index >= firstIndex && index <= lastIndex - 1) {
            row.classList.remove('hidden')
          } else {
            row.classList.add('hidden')
          }
        })

        if (totalRows === 0) {
          displayNoRecords()
        } else {
          displayRecords()
        }
      }

      const updatePagination = () => {
        const firstRecord = totalPages === 0 ? 0 : (currentPage - 1) * pageSize + 1
        const lastRecord = currentPage * pageSize
        const totalRecords = Math.min(lastRecord, totalRows)

        setRowsAndPages()

        for (const button of allPaginationButtons) {
          const buttonNumber = parseInt(button.innerText, 10)

          if (buttonNumber === currentPage) {
            button.classList.add(currentItemClassName)
          } else {
            button.classList.remove(currentItemClassName)
          }

          if (buttonNumber !== 1 && buttonNumber !== totalPages) {
            button.classList.add('hidden')
          }

          if (buttonNumber === currentPage || buttonNumber === currentPage + 1 || buttonNumber === currentPage - 1) {
            button.classList.remove('hidden')
          }

          if (currentPage === 1 && buttonNumber === 3) {
            button.classList.remove('hidden')
          }

          if (currentPage === totalPages && buttonNumber === totalPages - 2) {
            button.classList.remove('hidden')
          }

          if (buttonNumber > totalPages) {
            button.classList.add('hidden')
          }
        }

        if (totalPages <= 1) {
          pagination.classList.add('hidden')
        } else {
          pagination.classList.remove('hidden')
        }

        if (currentPage === 1) {
          prevButton.classList.add('hidden')
        } else {
          prevButton.classList.remove('hidden')
        }

        if (currentPage === totalPages) {
          nextButton.classList.add('hidden')
        } else {
          nextButton.classList.remove('hidden')
        }

        if (totalPages > 5) {
          if (currentPage < 4) {
            ellipses[0].classList.add('hidden')
          } else {
            ellipses[0].classList.remove('hidden')
          }

          if (ellipses[1] && currentPage > totalPages - 3) {
            ellipses[1].classList.add('hidden')
          } else {
            ellipses[1].classList.remove('hidden')
          }
        } else {
          for (const ellipsis of ellipses) {
            ellipsis.classList.add('hidden')
          }
        }

        paginationResults.innerText = `Showing ${firstRecord} to ${totalRecords} of ${totalRows} results`
      }

      const initialisePaginationButtons = () => {
        prevButton.addEventListener('click', event => {
          event.preventDefault()
          if (currentPage !== 1) {
            currentPage -= 1
            updateTable(currentPage)
            updatePagination(currentPage)
          }
          return false
        })

        nextButton.addEventListener('click', event => {
          event.preventDefault()
          if (currentPage !== totalPages) {
            currentPage += 1
            updateTable(currentPage)
            updatePagination(currentPage)
          }
          return false
        })

        const pageButtonEventHandler = button => event => {
          event.preventDefault()
          const newPage = parseInt(button.innerText, 10)
          currentPage = newPage
          updateTable()
          updatePagination()
          return false
        }

        for (const button of allPaginationButtons) {
          button.addEventListener('click', pageButtonEventHandler(button))
        }
      }

      const initialiseSortableTableButtons = () => {
        const sortableTableButtons = Array.from(
          table.querySelector('.govuk-table__head').getElementsByTagName('button'),
        )

        sortableTableButtons.forEach(button =>
          button.addEventListener('click', () => {
            setTimeout(() => updateTable(), 0)
          }),
        )
      }

      updateTable()
      updatePagination()
      initialiseSortableTableButtons()
      initialisePaginationButtons()
    }
  }
}

export default { init }
