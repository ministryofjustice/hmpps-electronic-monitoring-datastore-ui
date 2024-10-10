import * as emsSortableTable from './components/emsSortableTable.js'
import * as emsDateFilter from './components/emsDateFilter.js'
import * as emsSearchForm from './components/emsSearchForm.js'

function initAll() {
  emsDateFilter.init()
  emsSortableTable.init()
  emsSearchForm.init()
}

export { initAll }
