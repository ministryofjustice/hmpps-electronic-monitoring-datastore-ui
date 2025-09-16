import { RawOrderSearchCriteria } from '../../models/requests/SearchOrdersRequest'
import { HmppsUser } from '../../interfaces/hmppsUser'

export type FormError = {
  field: string
  message: string
}

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    formData: RawOrderSearchCriteria
    validationErrors: FormError[]
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }

    interface Locals {
      user: HmppsUser
    }
  }
}
