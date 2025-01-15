import { z } from 'zod'
import strings from '../../constants/strings'

export default class NameValidator {
  static firstName = z
    .string()
    .regex(/^[a-zA-Z]*$/, { message: strings.errors.invalidFirstName })
    .optional()

  static lastName = z
    .string()
    .regex(/^[a-zA-Z]*$/, { message: strings.errors.invalidLastName })
    .optional()

  static alias = z
    .string()
    .regex(/^[a-zA-Z\s]*$/, { message: strings.errors.invalidAlias })
    .optional()
}
