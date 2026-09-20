import z from 'zod'

export type OrderSearchCriteria = z.infer<typeof OrderSearchCriteria>
export const OrderSearchCriteria = z.object({
  legacySubjectId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  alias: z.string().optional(),
  dateOfBirth: z.string().optional(),
})
