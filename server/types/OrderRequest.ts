import { Token } from '../interfaces/token'

export type OrderRequest = Token & {
  orderId: string
}
