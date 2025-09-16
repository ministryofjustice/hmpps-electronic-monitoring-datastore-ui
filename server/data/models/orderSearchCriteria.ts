import z from 'zod'

export type OrderSearchCriteria = z.infer<typeof OrderSearchCriteria>
export const OrderSearchCriteria = z.object({
  legacySubjectId: z.string().nullish(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  alias: z.string().nullish(),
  dateOfBirth: z.string().nullish(),
})
