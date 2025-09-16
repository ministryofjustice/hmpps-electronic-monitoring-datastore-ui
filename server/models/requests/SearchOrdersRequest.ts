import { z } from 'zod'
import strings from '../../constants/strings'
import { Token } from '../../interfaces/token'

export type OrderSearchRequest = Token & {
  data: OrderSearchCriteria
}

export const OrderSearchFirstName = z
  .string()
  .regex(/^[a-zA-Z]*$/, { message: strings.errors.invalidFirstName })
  .nullish()
export const OrderSearchLastName = z
  .string()
  .regex(/^[a-zA-Z]*$/, { message: strings.errors.invalidLastName })
  .nullish()
export const OrderSearchAlias = z
  .string()
  .regex(/^[a-zA-Z\s]*$/, { message: strings.errors.invalidAlias })
  .nullish()

const atLeastOneDefined = (obj: Record<string | number | symbol, unknown>): boolean =>
  Object.values({ ...obj, searchType: undefined }).some(v => v !== '' && v !== undefined && v !== null)

const isValidDate = (obj: Record<string | number | symbol, unknown>): boolean => {
  if (!obj.dobYear && !obj.dobMonth && !obj.dobDay) {
    return true
  }

  if (obj.dobYear === '' && obj.dobMonth === '' && obj.dobDay === '') {
    return true
  }

  const dobYear = parseInt(`${obj.dobYear}`, 10)
  const dobMonth = parseInt(`${obj.dobMonth}`, 10)
  const dobDay = parseInt(`${obj.dobDay}`, 10)

  if (Number.isNaN(dobYear) || Number.isNaN(dobMonth) || Number.isNaN(dobDay)) {
    return false
  }

  const dob = obj.dob as Date
  if (!dob) {
    return true
  }

  return dob?.getDate() === dobDay && dob?.getMonth() === dobMonth - 1 && dob?.getFullYear() === dobYear
}

const isNotFutureDate = (obj: Record<string | number | symbol, unknown>): boolean => {
  const dob = obj.dob as Date
  if (!dob) {
    return true
  }

  return z.date().max(new Date()).safeParse(dob).success
}

const isNotOldDate = (obj: Record<string | number | symbol, unknown>): boolean => {
  const dob = obj.dob as Date
  if (!dob) {
    return true
  }

  return z.date().min(new Date('1900-01-01')).safeParse(dob).success
}

export type RawOrderSearchCriteria = z.input<typeof OrderSearchCriteria>
export type OrderSearchCriteria = z.infer<typeof OrderSearchCriteria>
export const OrderSearchCriteria = z
  .object({
    searchType: z.string().default('integrity'),
    legacySubjectId: z.string().nullish(),
    firstName: z
      .string()
      .regex(/^[a-zA-Z]*$/, { message: strings.errors.invalidFirstName, abort: false })
      .nullish(),
    lastName: z
      .string()
      .regex(/^[a-zA-Z]*$/, { message: strings.errors.invalidLastName, abort: false })
      .nullish(),
    alias: z
      .string()
      .regex(/^[a-zA-Z\s]*$/, { message: strings.errors.invalidAlias, abort: false })
      .nullish(),
    dobDay: z.coerce
      .string()
      .regex(/^[\d]*$/, { message: strings.errors.unrealDate, abort: false })
      .nullish(),
    dobMonth: z.coerce
      .string()
      .regex(/^[\d]*$/, { message: strings.errors.unrealDate, abort: false })
      .nullish(),
    dobYear: z.coerce
      .string()
      .regex(/^[\d]*$/, { message: strings.errors.unrealDate, abort: false })
      .nullish(),
  })
  .refine(atLeastOneDefined, {
    path: [],
    message: 'You must enter a value into at least one search field',
    abort: true,
  })
  .transform(data => {
    if (!data.dobYear && !data.dobMonth && !data.dobDay) {
      return data
    }

    if (data.dobYear === '' && data.dobMonth === '' && data.dobDay === '') {
      return data
    }

    const dobYear = parseInt(`${data.dobYear}`, 10)
    const dobMonth = parseInt(`${data.dobMonth}`, 10)
    const dobDay = parseInt(`${data.dobDay}`, 10)

    if (
      !z.int().safeParse(dobYear).success ||
      !z.int().safeParse(dobMonth).success ||
      !z.int().safeParse(dobDay).success
    ) {
      return data
    }

    return {
      ...data,
      dob: new Date(dobYear, dobMonth - 1, dobDay),
    }
  })
  .refine(isValidDate, {
    path: ['dob'],
    message: strings.errors.unrealDate,
    abort: true,
  })
  .refine(isNotFutureDate, {
    path: ['dob'],
    message: strings.errors.futureDate,
    abort: false,
  })
  .refine(isNotOldDate, {
    path: ['dob'],
    message: strings.errors.dateBelowLimit,
    abort: false,
  })
