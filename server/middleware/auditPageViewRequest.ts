import type { RequestHandler } from 'express'

import type { Page } from '../constants/pages'

import type { Services } from '../services'

/**
 * Middleware which audits page view requests.
 * This can be adapted to handle different subject types, reading offender identifiers from the path or session where appropriate.
 */
export default function auditPageViewRequest({ services, page }: { services: Services; page: Page }): RequestHandler {
  const { auditService } = services

  return async (req, res, next) => {
    const { user } = res.locals

    await auditService.logPageView(page, {
      correlationId: req.id,
      who: user.username,
    })

    next()
  }
}
