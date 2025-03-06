import { z } from 'zod'

const SearchOrderFormDataModel = z.object({
  searchType: z.string().optional(), // TODO: allow optional initially until AM data is available for searching
  legacySubjectId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  alias: z.string().optional(),
  'dob-day': z.string().optional(),
  'dob-month': z.string().optional(),
  'dob-year': z.string().optional(),
})

export const ParsedSearchFormDataModel = SearchOrderFormDataModel.transform(data => {
  return {
    searchType: data.searchType,
    legacySubjectId: data.legacySubjectId,
    firstName: data.firstName,
    lastName: data.lastName,
    alias: data.alias,
    dobDay: data['dob-day'],
    dobMonth: data['dob-month'],
    dobYear: data['dob-year'],
  }
})

export type SearchOrderFormData = z.infer<typeof SearchOrderFormDataModel>
export type ParsedSearchFormData = z.infer<typeof ParsedSearchFormDataModel>
