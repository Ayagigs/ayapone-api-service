import express from 'express'
import redoc from 'redoc-express'
import { StatusCodes } from 'http-status-codes'
import { AuthRoutes } from './api/v1/auth.js'
import { UserRoutes } from './api/v1/user.js'
import { ReviewRoutes } from './api/v1/reviewRoute.js'
import { CheckoutRoutes } from './api/v1/checkout.js'

export const router = express.Router()

router.get('/docs/collection.json', (req, res) => {
  res.sendFile('src/doc/collection.json', { root: '.' })
})

router.get(
  '/docs',
  redoc({
    title: 'API Docs',
    specUrl: '/docs/collection.json',
  }),
)

router.use('/api/v1', AuthRoutes)
router.use('/api/v1', UserRoutes)
router.use('/api/v1', ReviewRoutes)
router.use('/api/v1', CheckoutRoutes)

router.use((req, res) => {
  return res.status(StatusCodes.NOT_FOUND).json({})
})
