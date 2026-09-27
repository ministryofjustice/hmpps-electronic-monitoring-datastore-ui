import { type Page } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppFormPage from './appFormPage'
import OrderSearchFormComponent from './components/orderSearchForm'

export default class OrderSearchPage extends AppFormPage<OrderSearchFormComponent> {
  constructor(page: Page) {
    super(page, 'Search for orders', paths.SEARCH_ORDERS)

    this.formComponent = new OrderSearchFormComponent(this.page)
  }
}
