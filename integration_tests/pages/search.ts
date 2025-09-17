import AppFormPage from './appFormPage'
import paths from '../../server/constants/paths'
import OrderSearchFormComponent from './components/forms/orderSearchForm'

export default class SearchPage extends AppFormPage {
  constructor() {
    super('Search for order details', paths.SEARCH)
  }

  form = new OrderSearchFormComponent()
}
