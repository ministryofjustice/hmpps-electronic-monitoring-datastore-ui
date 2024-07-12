import * as emsSortableTable from './components/emsSortableTable.js'
import * as emsDateFilter from './components/emsDateFilter.js'

function initAll() {
  emsDateFilter.init()
  emsSortableTable.init()
}

export { initAll }
