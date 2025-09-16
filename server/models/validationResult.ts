import z from 'zod'

export type ValidationError = z.infer<typeof ValidationError>
export const ValidationError = z.object({
  field: z.string(),
  error: z.string(),
})

export type ValidationResult = z.infer<typeof ValidationResult>
export const ValidationResult = z.array(ValidationError)
