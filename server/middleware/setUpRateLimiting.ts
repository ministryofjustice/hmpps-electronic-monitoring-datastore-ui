import express, { Router } from 'express'
import RateLimit, { type Options } from 'express-rate-limit'
import config from '../config'

export default function setUpWebSession(): Router {
  const router = express.Router()

  // set up rate limiter: maximum of 30 requests per minute
  const limiter = RateLimit(config.rateLimiting as Partial<Options>)

  // apply rate limiter to all requests
  router.use(limiter)

  return router
}
