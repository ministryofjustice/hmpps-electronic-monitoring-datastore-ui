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

export type SearchOrderFormData = z.infer<typeof SearchOrderFormDataModel>

export default SearchOrderFormDataModel
