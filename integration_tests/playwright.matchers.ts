import { expect } from '@playwright/test'

import AppFormPage from './pages/appFormPage'
import FormComponent from './pages/components/formComponent'
import DateInputComponent from './pages/components/dateInputComponent'
import TextInputComponent from './pages/components/textInputComponent'
import RadiosComponent from './pages/components/radiosComponent'
import SummaryListComponent from './pages/components/summaryListComponent'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T> {
      toHaveForm(): Promise<R>
      toHaveErrorSummary(): Promise<R>
      toHaveErrorSummaryText(expected: string): Promise<R>

      toBeDisabledWithinForm(): Promise<R>
      toBeVisibleWithinForm(): Promise<R>

      toHaveValidationError(): Promise<R>
      toHaveValidationErrorText(expected: string): Promise<R>

      toHaveDateValue(expected: number | string | Date): Promise<R>
      toHaveItem(key: string, value: string): Promise<R>
      toHaveItems(items: Array<[string, string]>): Promise<R>
    }
  }
}

const customMatchers = {
  async toHaveForm<T extends FormComponent>(appFormPage: AppFormPage<T>) {
    const pass = await appFormPage.form.isVisible()

    return {
      pass,
      message: () => (pass ? 'Expected form not to be visible' : 'Expected form to be visible'),
    }
  },

  async toHaveErrorSummary<T extends FormComponent>(appFormPage: AppFormPage<T>) {
    const titleIsVisible = await appFormPage.errorSummary.title.isVisible()
    const errorListIsVisible = await appFormPage.errorSummary.errorList.isVisible()

    const pass = errorListIsVisible && titleIsVisible
    return {
      pass,
      message: () => (pass ? 'Expected error summary not to be visible' : 'Expected error summary to be visible'),
    }
  },

  async toHaveErrorSummaryText<T extends FormComponent>(appFormPage: AppFormPage<T>, expected: string) {
    const actual = (await appFormPage.errorSummary.errorList.textContent()) || ''
    const pass = actual.includes(expected) ?? false

    return {
      pass,
      message: () =>
        pass
          ? `Expected error summary not to have text content "${expected}"`
          : `Expected error summary to have text content "${expected}", but found "${actual}"`,
    }
  },

  async toHaveValidationError(formComponent: DateInputComponent | TextInputComponent | RadiosComponent) {
    const pass = await formComponent.validation.isVisible()

    return {
      pass,
      message: () =>
        pass
          ? `Expected form field not to have a validation error`
          : `Expected form field to have a validation error, but found none`,
    }
  },

  async toHaveValidationErrorText(
    formComponent: DateInputComponent | TextInputComponent | RadiosComponent,
    expected: string,
  ) {
    let pass = await formComponent.validation.isVisible()
    let actual = ''
    if (pass) {
      actual = (await formComponent.validation.textContent()) || ''
      pass = actual.includes(expected) ?? false
    }

    return {
      pass,
      message: () =>
        pass
          ? `Expected validation error not to have text content "${expected}"`
          : `Expected validation error to have text content "${expected}", but found "${actual}"`,
    }
  },

  async toBeVisibleWithinForm(formComponent: DateInputComponent | TextInputComponent | RadiosComponent) {
    const pass = await formComponent.isVisible()

    return {
      pass,
      message: () => (pass ? 'Expected field not to be visible' : 'Expected field to be visible'),
    }
  },

  async toBeDisabledWithinForm(formComponent: DateInputComponent | TextInputComponent | RadiosComponent) {
    const pass = await formComponent.isDisabled()

    return {
      pass,
      message: () => (pass ? 'Expected field not to be disabled' : 'Expected field to be disabled'),
    }
  },

  async toHaveDateValue(formComponent: DateInputComponent, expected: number | string | Date) {
    const expectedDate = new Date(expected)
    const expectedDateString = expectedDate.toISOString().split('T')[0]

    const actualDay = (await formComponent.dayField.inputValue()).padStart(2, '0')
    const actualMonth = (await formComponent.monthField.inputValue()).padStart(2, '0')
    const actualYear = (await formComponent.yearField.inputValue()).padStart(4, '0')
    const actualDateString = `${actualYear}-${actualMonth}-${actualDay}`

    const pass = actualDateString === expectedDateString

    return {
      pass,
      message: () =>
        pass
          ? `Expected field not to have value "${expected}"`
          : `Expected field to have value "${expected}", but found "${actualDateString}"`,
    }
  },

  async toHaveItem(summaryListComponent: SummaryListComponent, key: string, value: string) {
    const pass = await summaryListComponent.hasItem(key, value)

    return {
      pass,
      message: () =>
        pass
          ? `Expected summary list not to have item with key "${key}" and value "${value}"`
          : `Expected summary list to have item with key "${key}" and value "${value}", but it was not found`,
    }
  },

  async toHaveItems(summaryListComponent: SummaryListComponent, items: Array<[string, string]>) {
    const pass = await summaryListComponent.hasItems(items)

    return {
      pass,
      message: () =>
        pass
          ? `Expected summary list not to have items "${JSON.stringify(items)}"`
          : `Expected summary list to have items "${JSON.stringify(items)}", but some were not found`,
    }
  },
}

expect.extend(customMatchers)
