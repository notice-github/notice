import { Route } from 'typerestjs'
import { BillingController } from '../controllers/billing.controller'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { BillingSchema } from '../schemas/billing.schema'

export namespace BillingRoute {
	export const PREFIX = '/billing'

	export const get: Route<BillingSchema.get> = {
		method: 'GET',
		path: '/:workspaceId',
		middlewares: [GuardMiddleware.workspace({ role: 'admin', source: 'params' })],
		schema: BillingSchema.get,
		handler: BillingController.get,
	}

	export const details: Route<BillingSchema.details> = {
		method: 'GET',
		path: '/:workspaceId/details',
		middlewares: [GuardMiddleware.workspace({ role: 'admin', source: 'params' })],
		schema: BillingSchema.details,
		handler: BillingController.details,
	}
}
