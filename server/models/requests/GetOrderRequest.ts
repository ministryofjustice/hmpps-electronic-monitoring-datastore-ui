import { Token } from '../../interfaces/token'

export type GetOrderRequest = Token & {
  legacySubjectId: string
}
