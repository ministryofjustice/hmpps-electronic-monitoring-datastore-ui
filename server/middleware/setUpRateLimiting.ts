import express, { Router } from 'express'
import RateLimit from 'express-rate-limit'

export default function setUpWebSession(): Router {
  const router = express.Router()

  // set up rate limiter: maximum of 30 requests per minute
  const limiter = RateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 30, // max 30 requests per windowMs
  })

  // apply rate limiter to all requests
  router.use(limiter)

  return router
}
