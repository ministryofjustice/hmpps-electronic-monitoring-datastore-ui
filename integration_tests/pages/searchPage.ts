import { type Page } from '@playwright/test'

import { paths } from '../../server/constants/paths'

import AppFormPage from './appFormPage'
import OrderSearchFormComponent from './components/orderSearchForm'

export default class SearchPage extends AppFormPage<OrderSearchFormComponent> {
  constructor(page: Page) {
    super(page, 'Search for order details', paths.SEARCH)

    this.formComponent = new OrderSearchFormComponent(this.page)
  }
}
