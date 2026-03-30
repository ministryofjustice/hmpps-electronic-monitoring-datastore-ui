import emsSortableTable from './components/emsSortableTable.mjs'
import emsDateFilter from './components/emsDateFilter.mjs'
import emsSearchForm from './components/emsSearchForm.mjs'

export function initAll() {
  emsDateFilter.init()
  emsSortableTable.init()
  emsSearchForm.init()
}

export default { initAll }
