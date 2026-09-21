import { expect } from '@playwright/test'

import AppFormPage from './pages/appFormPage'
import FormComponent from './pages/components/formComponent'
import FormDateComponent from './pages/components/formDateComponent'
import FormInputComponent from './pages/components/formInputComponent'

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

  async toHaveValidationError(formComponent: FormDateComponent | FormInputComponent) {
    const pass = await formComponent.validation.isVisible()

    return {
      pass,
      message: () =>
        pass
          ? `Expected form field not to have a validation error`
          : `Expected form field to have a validation error, but found none`,
    }
  },

  async toHaveValidationErrorText(formComponent: FormDateComponent | FormInputComponent, expected: string) {
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

  async toBeVisibleWithinForm(formComponent: FormDateComponent | FormInputComponent) {
    switch (formComponent.constructor) {
      case FormDateComponent: {
        const dateFormComponent = formComponent as FormDateComponent

        const pass =
          (await dateFormComponent.dayField.isVisible()) &&
          (await dateFormComponent.monthField.isVisible()) &&
          (await dateFormComponent.yearField.isVisible())

        return {
          pass,
          message: () => (pass ? 'Expected date fields not to be visible' : 'Expected date fields to be visible'),
        }
      }

      case FormInputComponent: {
        const inputFormComponent = formComponent as FormInputComponent

        const pass = await inputFormComponent.field.isVisible()

        return {
          pass,
          message: () => (pass ? 'Expected input field not to be visible' : 'Expected input field to be visible'),
        }
      }

      default:
        throw new Error(`Unsupported form component: ${formComponent.constructor.name}`)
    }
  },

  async toBeDisabledWithinForm(formComponent: FormDateComponent | FormInputComponent) {
    switch (formComponent.constructor) {
      case FormDateComponent: {
        const dateFormComponent = formComponent as FormDateComponent

        const pass =
          (await dateFormComponent.dayField.isDisabled()) &&
          (await dateFormComponent.monthField.isDisabled()) &&
          (await dateFormComponent.yearField.isDisabled())

        return {
          pass,
          message: () => (pass ? 'Expected date fields not to be disabled' : 'Expected date fields to be disabled'),
        }
      }

      case FormInputComponent: {
        const inputFormComponent = formComponent as FormInputComponent

        const pass = await inputFormComponent.field.isDisabled()

        return {
          pass,
          message: () => (pass ? 'Expected input field not to be disabled' : 'Expected input field to be disabled'),
        }
      }

      default:
        throw new Error(`Unsupported form component: ${formComponent.constructor.name}`)
    }
  },

  async toHaveDateValue(formComponent: FormDateComponent, expected: number | string | Date) {
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
          ? `Expected date field not to have value "${expected}"`
          : `Expected date field to have value "${expected}", but found "${actualDateString}"`,
    }
  },
}

expect.extend(customMatchers)
