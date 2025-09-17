import z from 'zod'

export type ValidationError = z.infer<typeof ValidationError>
export const ValidationError = z.object({
  error: z.string(),
  field: z.string(),
  focusTarget: z.string().optional(),
})

export type ValidationResult = z.infer<typeof ValidationResult>
export const ValidationResult = z.array(ValidationError)
