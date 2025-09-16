import z from 'zod'

export type QueryExecutionResponse = z.infer<typeof QueryExecutionResponse>
export const QueryExecutionResponse = z.object({
  queryExecutionId: z.string(),
})
